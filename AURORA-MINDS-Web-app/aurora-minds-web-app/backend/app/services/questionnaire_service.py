import logging
from typing import List

import inject
from auto_dataclass.dj_model_to_dataclass import FromOrmToDataclass

from ..models.dtos.child_dto import ChildDto
from ..models.dtos.questionnaire_dto import QuestionnaireDto
from ..repositories.questionnaire_repository_interface import QuestionnaireRepositoryInterface
from ..services.questionnaire_service_interface import QuestionnaireServiceInterface
from ..utils.constant_messages import FAILED_TO_RETRIEVE_QUESTIONNAIRES, FAILED_TO_CREATE_QUESTIONNAIRE, \
    FAILED_TO_UPDATE_QUESTIONNAIRE, FAILED_TO_RETRIEVE_QUESTIONNAIRE
from ..utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class QuestionnaireService(QuestionnaireServiceInterface):
    @inject.autoparams()
    def __init__(self, questionnaire_repository: QuestionnaireRepositoryInterface):
        self.questionnaire_repository = questionnaire_repository
        self.converter = FromOrmToDataclass()

    def get_questionnaires_by_child_ids(self, child_ids: List[int]) -> List[QuestionnaireDto]:
        """
        Service to retrieve questionnaires for a list of child IDs.

        Args:
            child_ids (List[int]): List of child IDs.

        Returns:
            List[QuestionnaireDto]: List of Questionnaire DTOs.

        Raises:
            CustomException: If there is an error while retrieving the questionnaires.
        """
        try:
            questionnaires = self.questionnaire_repository.find_questionnaires_by_child_ids(child_ids)
            return [self.converter.to_dto(questionnaire, QuestionnaireDto) for questionnaire in questionnaires]
        except Exception as e:
            logger.error(
                f"[questionnaire_service:get_questionnaires_by_child_ids()] Error --> Failed to retrieve questionnaires for child IDs {child_ids}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_QUESTIONNAIRES)

    def get_questionnaire_by_child(self, child_dto: ChildDto) -> QuestionnaireDto:
        try:
            questionnaire = self.questionnaire_repository.find_questionnaire_by_child_id(child_dto.child_id)
            if questionnaire:
                return self.converter.to_dto(questionnaire, QuestionnaireDto)
            else:
                raise CustomException(FAILED_TO_RETRIEVE_QUESTIONNAIRE)
        except Exception as e:
            logger.error(f"[questionnaire_service:get_questionnaire_by_child()] Error --> {e}")
            raise CustomException(FAILED_TO_RETRIEVE_QUESTIONNAIRE)

    def create_questionnaire_serv(self, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        """
        Service to create a new questionnaire record.

        Args:
            questionnaire_dto (QuestionnaireDto): The Questionnaire DTO containing the details to be created.

        Returns:
            QuestionnaireDto: The created Questionnaire DTO.

        Raises:
            CustomException: If there is an error while creating the questionnaire.
        """
        try:
            questionnaire = self.questionnaire_repository.create_questionnaire_rep(questionnaire_dto)
            return self.converter.to_dto(questionnaire, QuestionnaireDto)
        except Exception as e:
            logger.error(
                f"[questionnaire_service:create_questionnaire()] Error --> Failed to create questionnaire: {e}")
            raise CustomException(FAILED_TO_CREATE_QUESTIONNAIRE)

    def update_questionnaire_serv(self, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        """
        Service to update an existing questionnaire record.

        Args:
            questionnaire_dto (QuestionnaireDto): The Questionnaire DTO containing the details to be updated.

        Returns:
            QuestionnaireDto: The updated Questionnaire DTO.

        Raises:
            CustomException: If there is an error while updating the questionnaire.
        """
        try:
            questionnaire = self.questionnaire_repository.update_questionnaire_rep(questionnaire_dto)
            return self.converter.to_dto(questionnaire, QuestionnaireDto)
        except Exception as e:
            logger.error(
                f"[questionnaire_service:update_questionnaire()] Error --> Failed to update questionnaire with ID {questionnaire_dto.questionnaire_id}: {e}")
            raise CustomException(FAILED_TO_UPDATE_QUESTIONNAIRE)
