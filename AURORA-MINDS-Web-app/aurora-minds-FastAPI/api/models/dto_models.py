from typing import Optional

from pydantic import BaseModel

''' The file is responsible for validating incoming data according 
to the defined schema (database_models.py) and serialize output data for the API responses (DTOs)'''


class ORMBasedModel(BaseModel):
    class Config:
        from_attributes = True  # (before was called) orm_mode


class AdhdDto(ORMBasedModel):
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
    clinician_id: int
    child_id: int


class UserDto(ORMBasedModel):
    username: str


class UserInDB(UserDto):
    id: int
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UpdateParentIdRequest(BaseModel):
    child_id: int
    parent_id: Optional[int]
