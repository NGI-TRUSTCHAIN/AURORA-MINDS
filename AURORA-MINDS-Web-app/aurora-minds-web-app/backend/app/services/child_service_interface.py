from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.child_dto import ChildDto


class ChildServiceInterface(ABC):

    @abstractmethod
    def get_children_by_user(self, user_id: int, role: str) -> List[ChildDto]:
        pass

    @abstractmethod
    def create_child_serv(self, child_dto: ChildDto) -> ChildDto:
        pass

    @abstractmethod
    def update_child_serv(self, child_dto: ChildDto) -> ChildDto:
        pass

    @abstractmethod
    def delete_child_serv(self, child_dto: ChildDto) -> None:
        pass
