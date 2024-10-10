from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.adhd_dto import AdhdDto
from ..models.entities.adhd import Adhd


class AdhdRepositoryInterface(ABC):
    @abstractmethod
    def find_adhd_records_by_child_ids(self, child_ids: List[int]) -> List[Adhd]:
        pass

    @abstractmethod
    def create_adhd_record_rep(self, adhd_dto: AdhdDto) -> Adhd:
        pass

    @abstractmethod
    def update_adhd_record_rep(self, adhd_dto: AdhdDto) -> Adhd:
        pass
