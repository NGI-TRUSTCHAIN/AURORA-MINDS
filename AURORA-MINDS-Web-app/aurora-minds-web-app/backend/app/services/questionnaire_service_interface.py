from abc import ABC, abstractmethod
from typing import List

from ..models.dtos.child_dto import ChildDto
from ..models.dtos.questionnaire_dto import QuestionnaireDto


class QuestionnaireServiceInterface(ABC):
    @abstractmethod
    def get_questionnaires_by_child_ids(self, child_ids: List[int]) -> List[QuestionnaireDto]:
        pass

    def get_questionnaire_by_child(self, child_dto: ChildDto) -> QuestionnaireDto:
        pass

    @abstractmethod
    def create_questionnaire_serv(self, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        pass

    @abstractmethod
    def update_questionnaire_serv(self, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        pass
