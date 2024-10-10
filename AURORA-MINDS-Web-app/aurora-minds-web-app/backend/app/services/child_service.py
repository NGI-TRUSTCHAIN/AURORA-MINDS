import logging
from typing import List

import inject
from auto_dataclass.dj_model_to_dataclass import FromOrmToDataclass

from ..models.dtos.child_dto import ChildDto
from ..repositories.child_repository_interface import ChildRepositoryInterface
from ..services.child_service_interface import ChildServiceInterface
from ..utils.constant_messages import FAILED_TO_RETRIEVE_CHILDREN, FAILED_TO_CREATE_CHILD, FAILED_TO_UPDATE_CHILD, \
    FAILED_TO_DELETE_CHILD, USER_PERMISSION_DENIED
from ..utils.enums import Role
from ..utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class ChildService(ChildServiceInterface):
    @inject.autoparams()
    def __init__(self, child_repository: ChildRepositoryInterface):
        self.child_repository = child_repository
        self.converter = FromOrmToDataclass()

    def get_children_by_user(self, user_id: int, role: str) -> List[ChildDto]:
        """
        Service to retrieve children records based on user role.
        """
        try:
            if role == Role.PARENT.value:
                children = self.child_repository.find_children_by_parent_id(user_id)
            elif role == Role.CLINICIAN.value:
                children = self.child_repository.find_children_by_clinician_id(user_id)
            else:
                raise CustomException(USER_PERMISSION_DENIED)

            return [self.converter.to_dto(child, ChildDto) for child in children]
        except Exception as e:
            logger.error(
                f"[child_service:get_children_by_user()] Error -->"
                f" Failed to retrieve children for user ID {user_id} with role {role}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_CHILDREN)

    def create_child_serv(self, child_dto: ChildDto) -> ChildDto:
        """
        Service to create a new child record.
        """
        try:
            child = self.child_repository.create_child_rep(child_dto)
            return self.converter.to_dto(child, ChildDto)
        except Exception as e:
            logger.error(f"[child_service:create_child()] Error --> Failed to create child: {e}")
            raise CustomException(FAILED_TO_CREATE_CHILD)

    def update_child_serv(self, child_dto: ChildDto) -> ChildDto:
        """
        Service to update an existing child record.
        """
        try:
            child = self.child_repository.update_child_rep(child_dto)
            return self.converter.to_dto(child, ChildDto)
        except Exception as e:
            logger.error(f"[child_service:create_child()] Error --> "
                         f"Failed to update child with ID {child_dto.child_id}: {e}")
            raise CustomException(FAILED_TO_UPDATE_CHILD)

    def delete_child_serv(self, child_dto: ChildDto) -> None:
        """
        Service to delete a child record.
        """
        try:
            self.child_repository.delete_child_rep(child_dto.child_id)
        except Exception as e:
            logger.error(
                f"[child_service:create_child()] Error --> Failed to delete child with ID {child_dto.child_id}: {e}")
            raise CustomException(FAILED_TO_DELETE_CHILD)
