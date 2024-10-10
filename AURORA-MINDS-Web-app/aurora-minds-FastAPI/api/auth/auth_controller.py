from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from api.models.db_models import User
from api.models.dto_models import UserInDB, Token
from api.utils.database_session_manager import db_manager
from api.utils.settings import settings

# Initializations
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login-token")
httpException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect username or password",
    headers={"WWW-Authenticate": "Bearer"}
)


class AuthController:
    def __init__(self, db: Session):
        """
        Initialize AuthController with a database session.

        :param db: SQLAlchemy session
        """
        self.db = db

    # === Repository Methods === #
    async def _get_user_by_username(self, username: str):
        """
        Retrieve a user by their username from the database.

        :param username: The username of the user to retrieve
        :return: The user object if found, otherwise None
        """
        async with self.db as session:
            async_result = await session.execute(select(User).filter(User.username == username))
            return async_result.scalars().first()

    # === Service Methods === #
    @staticmethod
    def _verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify if the provided plain password matches the hashed password.

        :param plain_password: The plain text password
        :param hashed_password: The hashed password stored in the database
        :return: True if the passwords match, otherwise False
        """
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    @staticmethod
    def _create_access_token(*, data: dict):
        """
        Create a JWT access token.

        :param data: The data to encode in the token
        :return: The encoded JWT token
        """
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt

    async def _get_authenticated_user(self, username: str, password: str):
        """
        Authenticate a user by their username and password.

        :param username: The username of the user
        :param password: The plain text password of the user
        :return: The authenticated user object if credentials are correct, otherwise None
        """
        user = await self._get_user_by_username(username)
        if not user or not self._verify_password(password, user.hashed_password):
            return None
        return UserInDB.from_orm(user)

    async def _get_authenticated_user_details(self, token: str):
        """
        Get the details of the authenticated user using the provided JWT token.

        :param token: The JWT token
        :return: The authenticated user object if the token is valid, otherwise raises HTTPException
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            user = await self._get_user_by_username(username)
            if user is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        return UserInDB.from_orm(user)


async def verify_jwt(authorization: str = Header()):
    """
    Verify the provided JWT token.

    :param authorization: The Authorization header containing the JWT token
    :return: None, raises HTTPException if the token is invalid
    """
    jwt_token = authorization.split(" ", 1)[1]
    try:
        jwt.decode(jwt_token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise HTTPException(status_code=401, detail="Unauthorized token")


# Dependency Injection
def get_auth_controller(db: Session = Depends(db_manager.get_db)):
    """
    Dependency injection for AuthController.

    :param db: SQLAlchemy session
    :return: Instance of AuthController
    """
    return AuthController(db)


# API Endpoints
@router.post("/login-token", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        auth_controller: AuthController = Depends(get_auth_controller)
):
    """
    Endpoint for user authentication. Receives the user's username and password
    via OAuth2PasswordRequestForm, attempts to authenticate the user, and returns a
    JWT token if authentication is successful.

    :param form_data: The form data containing username and password
    :param auth_controller: The AuthController instance
    :return: The access token and token type
    """
    user = await auth_controller._get_authenticated_user(form_data.username, form_data.password)
    if not user:
        raise httpException
    access_token = auth_controller._create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserInDB)
async def get_loggedin_user_details(
        auth_controller: AuthController = Depends(get_auth_controller),
        token: str = Depends(oauth2_scheme)
):
    """
    Endpoint to retrieve the currently authenticated user's details.
    This uses the JWT token provided in the Authorization header to find the user.

    :param auth_controller: The AuthController instance
    :param token: The JWT token
    :return: The authenticated user's details
    """
    current_user = await auth_controller._get_authenticated_user_details(token)
    if not current_user:
        raise httpException
    return current_user
