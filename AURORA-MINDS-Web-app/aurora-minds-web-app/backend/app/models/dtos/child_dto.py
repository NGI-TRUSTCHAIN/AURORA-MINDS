from dataclasses import dataclass

from ...models.dtos.user_dto import UserDto


@dataclass
class ChildDto:
    child_id: int
    first_name: str
    last_name: str
    score: float
    parent_id: UserDto
    clinician_id: UserDto
