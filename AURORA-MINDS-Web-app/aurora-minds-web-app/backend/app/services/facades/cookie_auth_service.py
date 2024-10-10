import logging

import inject
from auto_dataclass.dj_model_to_dataclass import FromOrmToDataclass
from rest_framework_simplejwt.tokens import RefreshToken

from ...models.dtos.user_dto import UserDto
from ...repositories.user_repository_interface import UserRepositoryInterface
from ...utils.constant_messages import INVALID_CREDENTIALS
from ...utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class CookieAuthService:
    """
    Service for handling authentication via cookies.
    """

    @inject.autoparams()
    def __init__(self, user_repository: UserRepositoryInterface):
        self.user_repository = user_repository
        self.converter = FromOrmToDataclass()

    def authenticate_with_cookie(self, cookie_data):
        """
        Authenticate a user based on provided cookie data.

        Args:
            cookie_data (dict): The cookie data containing user information.

        Returns:
            dict: The authenticated user instance and tokens.

        Raises:
            CustomException: If authentication fails.
        """
        # Check cookie's email and get user
        email = cookie_data.get('middle_name')
        user_id = cookie_data.get('nickname')
        if not email or not user_id:
            raise CustomException("Invalid cookie data")
        user = self.user_repository.find_user_by_id_and_email(user_id, email)
        if not user:
            raise CustomException(INVALID_CREDENTIALS)
        # Update the last_login field
        self.user_repository.update_last_login(user)
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        # Convert to dto for the serialization
        user_dto = self.converter.to_dto(user, UserDto)
        user_dto_dict = user_dto.__dict__  # Convert the DTO to a dictionary
        return {
            'user': user_dto_dict,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
