from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.questionnaire_dto import QuestionnaireDto
from ..models.entities.questionnaire import Questionnaire


class QuestionnaireRepositoryInterface(ABC):
    @abstractmethod
    def find_questionnaires_by_child_ids(self, child_ids: List[int]) -> List[Questionnaire]:
        pass

    @abstractmethod
    def find_questionnaire_by_child_id(self, child_id: int) -> Questionnaire:
        pass

    @abstractmethod
    def create_questionnaire_rep(self, questionnaire: Questionnaire) -> Questionnaire:
        pass

    @abstractmethod
    def update_questionnaire_rep(self, questionnaire_dto: QuestionnaireDto) -> Questionnaire:
        pass
