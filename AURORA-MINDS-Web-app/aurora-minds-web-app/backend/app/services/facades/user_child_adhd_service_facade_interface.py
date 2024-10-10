from abc import ABC, abstractmethod
from typing import List

from ...models.dtos.adhd_dto import AdhdDto


class UserChildAdhdServiceFacadeInterface(ABC):
    @abstractmethod
    def get_adhd_records_for_user(self, user_id: int) -> List[AdhdDto]:
        pass
