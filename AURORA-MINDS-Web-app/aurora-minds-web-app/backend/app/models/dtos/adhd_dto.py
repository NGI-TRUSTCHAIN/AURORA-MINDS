from dataclasses import dataclass

from ...models.dtos.child_dto import ChildDto


@dataclass
class AdhdDto:
    adhd_id: int
    perception_1: float
    fine_motor: float
    pre_writing: float
    visual_motor_integration: float
    spatial_orientation: float
    perception_2: float
    cognitive_flexibility: float
    attention_deficit: float
    sustained_attention: float
    target: float
    child_id: ChildDto
