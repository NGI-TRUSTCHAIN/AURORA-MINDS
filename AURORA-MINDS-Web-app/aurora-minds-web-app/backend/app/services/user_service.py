import logging
from typing import List

import inject
from auto_dataclass.dj_model_to_dataclass import FromOrmToDataclass
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from ..models.dtos.user_dto import UserDto
from ..models.dtos.user_dto import UserLoginDto
from ..models.dtos.user_dto import UserRegistrationDto
from ..repositories.user_repository_interface import UserRepositoryInterface
from ..services.user_service_interface import UserServiceInterface
from ..utils.constant_messages import INVALID_CREDENTIALS, FAILED_TO_RETRIEVE_USER, INVALID_ROLE, ALL_FIELDS_REQUIRED
from ..utils.enums import Role
from ..utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class UserService(UserServiceInterface):
    """
    Concrete implementation of UserServiceInterface
    """

    @inject.autoparams()
    def __init__(self, user_repository: UserRepositoryInterface):
        """
        Initialize the UserService with a UserRepository instance.

        Args:
            user_repository (UserRepositoryInterface): The user repository instance.
        """
        self.user_repository = user_repository
        self.converter = FromOrmToDataclass()

    def register_user(self, registered_user_dto: UserRegistrationDto):
        """
        Register a new user with the given details.

        Args:
            email (str): The user's email address.
            password (str): The user's password.
            first_name (str): The user's first name.
            last_name (str): The user's last name.
            contact_number (str): The user's contact number.
            role (str): The user's role.

        Returns:
            User: The created user instance.
            :param registered_user_dto: the object that includes all the above args (coming from the frontend)
        """
        self.__register_validations(registered_user_dto)
        return self.user_repository.create_user(registered_user_dto)

    def authenticate_user(self, login_user_dto: UserLoginDto):
        """
        Authenticate a user with the given email and password.

        Args:
            email (str): The user's email address.
            password (str): The user's password.

        Returns:
            dict: The authenticated user instance and tokens if credentials are correct, otherwise None.
            :param login_user_dto: the object that includes the two above args (coming from the frontend)
        """
        user = authenticate(email=login_user_dto.email, password=login_user_dto.password)  # From Django auth lib
        if not user:
            raise CustomException(INVALID_CREDENTIALS)
        # Update the last_login field
        self.user_repository.update_last_login(user)
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        # Return tokens
        return {
            'user': user,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

    def get_users_by_role(self, role: str) -> List[UserDto]:
        """
        Retrieve a list of users based on their role.

        Args:
            role (str): The role to filter users by.

        Returns:
            List[UserDto]: A list of user data transfer objects with the specified role.

        Raises:
            CustomException: If there is an issue retrieving the users.
        """
        try:
            users = self.user_repository.find_by_role(role)
            return [self.converter.to_dto(user, UserDto) for user in users]
        except Exception as e:
            logger.error(f"[user_service:get_users_by_role()] Error --> retrieving users with role {role}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_USER)

    def get_user_by_id(self, user_id: int) -> UserDto:
        """
        Service to get the user based on the given id.
        """
        try:
            user = self.user_repository.find_by_id(user_id)
            if user:
                return self.converter.to_dto(user, UserDto)
            return None
        except Exception as e:
            logger.error(f"[user_service:get_user_by_id()] Error --> retrieving user with ID {user_id}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_USER)

    def get_user_by_id_and_role(self, user_id: int, role: str) -> UserDto:
        """
        Retrieve a user based on their ID and role, converting the result to a UserDto.
        Throws an exception if the user does not exist or the role does not match.

        Args:
            user_id (int): The ID of the user to retrieve.
            role (str): The role to match in the retrieval.

        Returns:
            UserDto: The user data transfer object if the user exists with the specified role.

        Raises:
            CustomException: If the user cannot be retrieved or if the role does not match.
        """
        try:
            user = self.user_repository.find_by_id_and_role(user_id, role)
            if user:
                return self.converter.to_dto(user, UserDto)
            else:
                raise CustomException(FAILED_TO_RETRIEVE_USER)
        except Exception as e:
            logger.error(
                f"[user_service:get_user_by_id_and_role()] Error --> retrieving user with ID {user_id} and role {role}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_USER)

    @staticmethod
    def __register_validations(user_register_dto):
        """
        Validate the user registration details.

        Raises:
            CustomException: If any validation fails.
        """
        if user_register_dto.role not in Role.list_roles():
            raise CustomException(INVALID_ROLE)

        if (not user_register_dto.email or not user_register_dto.password
                or not user_register_dto.first_name or not user_register_dto.last_name
                or not user_register_dto.contact_number or not user_register_dto.role
        ):
            raise CustomException(ALL_FIELDS_REQUIRED)
