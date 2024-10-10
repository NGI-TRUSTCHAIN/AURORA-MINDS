from abc import ABC, abstractmethod
from typing import List

from ...models.dtos.child_dto import ChildDto


class UserChildServiceFacadeInterface(ABC):
    @abstractmethod
    def get_children_by_user_facade(self, user_id: int, role: str) -> List[ChildDto]:
        pass

    @abstractmethod
    def create_parent_child_serv(self, parent_id: int, child_dto: ChildDto) -> ChildDto:
        pass

    @abstractmethod
    def update_parent_child_serv(self, parent_id: int, child_dto: ChildDto) -> ChildDto:
        pass

    @abstractmethod
    def delete_parent_child_serv(self, parent_id: int, child_dto: ChildDto) -> None:
        pass
