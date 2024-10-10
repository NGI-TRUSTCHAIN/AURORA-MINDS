from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.child_dto import ChildDto
from ..models.entities.child import Child


class ChildRepositoryInterface(ABC):

    @abstractmethod
    def find_children_by_parent_id(self, parent_id: int) -> List[Child]:
        pass

    @abstractmethod
    def find_children_by_clinician_id(self, clinician_id: int) -> List[Child]:
        pass

    @abstractmethod
    def create_child_rep(self, child_dto: ChildDto) -> Child:
        pass

    @abstractmethod
    def update_child_rep(self, child_dto: ChildDto) -> Child:
        pass

    @abstractmethod
    def delete_child_rep(self, child_id: int) -> None:
        pass
