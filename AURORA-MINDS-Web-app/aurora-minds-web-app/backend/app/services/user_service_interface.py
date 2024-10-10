from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.user_dto import UserDto


class UserServiceInterface(ABC):
    """
    Interface for User Service
    """

    @abstractmethod
    def register_user(self, registered_user_dto):
        pass

    @abstractmethod
    def authenticate_user(self, login_user_dto):
        pass

    @abstractmethod
    def get_users_by_role(self, role: str) -> List[UserDto]:
        pass

    @abstractmethod
    def get_user_by_id(self, user_id: int) -> UserDto:
        pass

    @abstractmethod
    def get_user_by_id_and_role(self, user_id: int, role: str) -> UserDto:
        pass
