from abc import ABC, abstractmethod
from typing import List

from ...models.dtos.child_dto import ChildDto
from ...models.dtos.questionnaire_dto import QuestionnaireDto


class UserChildQuestionnaireServiceFacadeInterface(ABC):
    @abstractmethod
    def get_questionnaires_by_user(self, user_id: int) -> List[QuestionnaireDto]:
        pass

    def get_questionnaire_by_child(self, user_id: int, child_dto: ChildDto) -> QuestionnaireDto:
        pass

    @abstractmethod
    def create_questionnaire_facade(self, parent_id: int, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        pass

    @abstractmethod
    def update_questionnaire_facade(self, parent_id: int, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        pass
