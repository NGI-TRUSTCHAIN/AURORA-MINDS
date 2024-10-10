from dataclasses import dataclass
from datetime import date
from typing import Optional

from ...models.dtos.child_dto import ChildDto


@dataclass
class QuestionnaireDto:
    gender: str
    weight: float
    height: float
    date_of_birth: date
    is_native_greek_language: bool
    place_of_residence: str
    regional_unit: str
    school_name: str
    school_grade: str
    school_class_section: str
    has_parent_fully_custody: bool
    comments: str
    has_hearing_problem: bool
    has_vision_problem: bool
    has_early_learning_difficulties: bool
    has_delayed_development: bool
    has_autism: bool
    has_deprivation_neglect: bool
    has_childhood_aphasia: bool
    has_intellectual_disability: bool
    child_id: ChildDto
    questionnaire_id: Optional[int] = None
