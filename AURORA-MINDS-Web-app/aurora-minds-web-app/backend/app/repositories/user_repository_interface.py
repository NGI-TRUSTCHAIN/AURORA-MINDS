from abc import ABC, abstractmethod
from typing import List

from ..models.entities.user import User


class UserRepositoryInterface(ABC):
    """
    Interface for User Repository
    """

    @abstractmethod
    def create_user(self, registered_user_dto):
        pass

    @abstractmethod
    def update_last_login(self, user):
        pass

    @abstractmethod
    def find_by_role(role: str) -> List[User]:
        pass

    @abstractmethod
    def find_by_id(self, user_id: int) -> User:
        pass

    @abstractmethod
    def find_by_id_and_role(user_id: int, role: str) -> User:
        pass

    @abstractmethod
    def find_user_by_id_and_email(self, user_id: int, email: str) -> User:
        pass
