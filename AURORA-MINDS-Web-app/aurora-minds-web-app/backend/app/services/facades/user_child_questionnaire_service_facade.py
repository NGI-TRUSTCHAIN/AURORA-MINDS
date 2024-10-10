import logging

import inject

from .user_child_questionnaire_service_facade_interface import UserChildQuestionnaireServiceFacadeInterface
from ...models.dtos.child_dto import ChildDto
from ...models.dtos.questionnaire_dto import QuestionnaireDto
from ...services.child_service_interface import ChildServiceInterface
from ...services.questionnaire_service_interface import QuestionnaireServiceInterface
from ...services.user_service_interface import UserServiceInterface
from ...utils.constant_messages import USER_PERMISSION_DENIED, FAILED_TO_RETRIEVE_USER, \
    FAILED_TO_RETRIEVE_QUESTIONNAIRES, FAILED_TO_CREATE_QUESTIONNAIRE, FAILED_TO_UPDATE_QUESTIONNAIRE, \
    CHILD_PERMISSION_DENIED, FAILED_TO_RETRIEVE_QUESTIONNAIRE
from ...utils.enums import Role
from ...utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class UserChildQuestionnaireServiceFacade(UserChildQuestionnaireServiceFacadeInterface):
    @inject.autoparams()
    def __init__(self, user_service: UserServiceInterface, child_service: ChildServiceInterface,
                 questionnaire_service: QuestionnaireServiceInterface):
        self.user_service = user_service
        self.child_service = child_service
        self.questionnaire_service = questionnaire_service

    def get_questionnaires_by_user(self, user_id: int) -> list[QuestionnaireDto]:
        """
        Retrieve questionnaires for a user based on their role.

        Args:
            user_id (int): The user ID.

        Returns:
            list: List of Questionnaire DTOs.
        """
        try:
            # Get user info
            user = self.user_service.get_user_by_id(user_id)
            if not user:
                raise CustomException(FAILED_TO_RETRIEVE_USER)

            # Get children based on the user role
            children = self.child_service.get_children_by_user(user_id, user.role)

            # If the user is not associated with any child, return empty list
            if not children:
                return []

            # Get all ids of the children that were found
            child_ids = [child.child_id for child in children]
            # Get each child's questionnaire records
            questionnaires = self.questionnaire_service.get_questionnaires_by_child_ids(child_ids)
            return questionnaires
        except CustomException as e:
            logger.error(f"[user_questionnaire_service_facade:get_questionnaires_for_user()] Error --> {e}")
            raise e
        except Exception as e:
            logger.error(
                f"[user_questionnaire_service_facade:get_questionnaires_for_user()] Error --> "
                f"Failed to retrieve questionnaires for user ID {user_id}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_QUESTIONNAIRES)

    def get_questionnaire_by_child(self, user_id: int, child_dto: ChildDto) -> QuestionnaireDto:
        """
        Retrieve the questionnaire associated with a specific child.

        This method fetches a user's details and checks if the user has the necessary permissions
        (either a parent or a clinician) to access the child's questionnaire. If the permissions
        are valid, it attempts to retrieve the questionnaire for the given child. If any error
        occurs during this process, a custom exception is raised and logged.

        Args:
            user_id (int): The ID of the user requesting the questionnaire.
            child_dto (ChildDto): Data transfer object containing details about the child.

        Returns:
            QuestionnaireDto: The questionnaire associated with the specified child.

        Raises:
            CustomException: If the user does not have the required permissions.
            CustomException: If the questionnaire retrieval process fails.
        """
        user_dto = self.user_service.get_user_by_id(user_id)
        if not user_dto or user_dto.role not in [Role.PARENT.value, Role.CLINICIAN.value]:
            raise CustomException(USER_PERMISSION_DENIED)
        try:
            return self.questionnaire_service.get_questionnaire_by_child(child_dto)
        except CustomException as e:
            logger.error(
                f"[UserChildQuestionnaireFacade:get_questionnaire_by_child()] Error --> retrieving questionnaire for child ID {child_dto.child_id}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_QUESTIONNAIRE)

    def create_questionnaire_facade(self, parent_id: int, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        """
        Create a questionnaire record for a child by a parent.

        Args:
            parent_id (int): The parent ID.
            questionnaire_dto (QuestionnaireDto): The Questionnaire DTO containing the details to be created.

        Returns:
            QuestionnaireDto: The created Questionnaire DTO.
        """
        try:
            # Get user info
            user = self.user_service.get_user_by_id(parent_id)
            if not user or user.role != Role.PARENT.value:
                raise CustomException(USER_PERMISSION_DENIED)

            # Check if any of the parent's children belongs to the questionnaire
            children = self.child_service.get_children_by_user(parent_id, Role.PARENT.value)
            if not any(child.child_id == questionnaire_dto.child_id.child_id for child in children):
                raise CustomException(CHILD_PERMISSION_DENIED)

            # Create the questionnaire in the DB and return it
            return self.questionnaire_service.create_questionnaire_serv(questionnaire_dto)
        except Exception as e:
            logger.error(
                f"[user_questionnaire_service_facade:create_questionnaire_for_child()] Error --> "
                f"Failed to create questionnaire for parent ID {parent_id}: {e}")
            raise CustomException(FAILED_TO_CREATE_QUESTIONNAIRE)

    def update_questionnaire_facade(self, parent_id: int, questionnaire_dto: QuestionnaireDto) -> QuestionnaireDto:
        """
        Update a questionnaire record for a child by a parent.

        Args:
            parent_id (int): The parent ID.
            questionnaire_dto (QuestionnaireDto): The Questionnaire DTO containing the details to be updated.

        Returns:
            QuestionnaireDto: The updated Questionnaire DTO.
        """
        try:
            # Get user info
            user = self.user_service.get_user_by_id(parent_id)
            if not user or user.role != Role.PARENT.value:
                raise CustomException(USER_PERMISSION_DENIED)

            # Check if any of the parent's children belongs to the questionnaire
            children = self.child_service.get_children_by_user(parent_id, Role.PARENT.value)
            if not any(child.child_id == questionnaire_dto.child_id.child_id for child in children):
                raise CustomException(CHILD_PERMISSION_DENIED)

            # Update the questionnaire in the DB and return it
            return self.questionnaire_service.update_questionnaire_serv(questionnaire_dto)
        except Exception as e:
            logger.error(
                f"[user_questionnaire_service_facade:update_questionnaire_for_child()] Error --> "
                f"Failed to update questionnaire for parent ID {parent_id}: {e}")
            raise CustomException(FAILED_TO_UPDATE_QUESTIONNAIRE)
