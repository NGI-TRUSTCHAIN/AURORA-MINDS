from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.adhd_dto import AdhdDto


class AdhdServiceInterface(ABC):
    @abstractmethod
    def get_adhd_records_by_child_ids(self, child_ids: List[int]) -> List[AdhdDto]:
        pass

    @abstractmethod
    def create_adhd_record_serv(self, adhd_dto: AdhdDto) -> AdhdDto:
        pass

    @abstractmethod
    def update_adhd_record_serv(self, adhd_dto: AdhdDto) -> AdhdDto:
        pass
