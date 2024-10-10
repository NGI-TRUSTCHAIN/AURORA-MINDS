import datetime
from typing import List

import pytz

from ..models.entities.user import User
from ..repositories.user_repository_interface import UserRepositoryInterface


class UserRepository(UserRepositoryInterface):
    """
    Concrete implementation of UserRepositoryInterface
    """

    @staticmethod
    def create_user(registered_user_dto):
        """
        Create and return a new user with the given details.
        This method is defined in the 'user.py --> UserManager(BaseUserManager)' class

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
        return User.objects.create_user(email=registered_user_dto.email,
                                        password=registered_user_dto.password,
                                        first_name=registered_user_dto.first_name,
                                        last_name=registered_user_dto.last_name,
                                        contact_number=registered_user_dto.contact_number,
                                        role=registered_user_dto.role)

    @staticmethod
    def update_last_login(user):
        greek_tz = pytz.timezone('UTC')
        user.last_login = greek_tz.localize(datetime.datetime.now())
        user.save(update_fields=['last_login'])

    @staticmethod
    def find_by_role(role: str) -> List[User]:
        return User.objects.filter(role=role).all()

    @staticmethod
    def find_by_id(user_id: int) -> User:
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    @staticmethod
    def find_by_id_and_role(user_id: int, role: str) -> User:
        try:
            return User.objects.get(pk=user_id, role=role)
        except User.DoesNotExist:
            return None

    @staticmethod
    def find_user_by_id_and_email(user_id: int, email: str) -> User:
        try:
            return User.objects.get(pk=user_id, email=email)
        except User.DoesNotExist:
            return None
