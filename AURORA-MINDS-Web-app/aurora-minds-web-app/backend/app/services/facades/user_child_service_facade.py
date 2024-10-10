import logging
from typing import List

import inject

from .user_child_service_facade_interface import UserChildServiceFacadeInterface
from ...models.dtos.child_dto import ChildDto
from ...services.child_service_interface import ChildServiceInterface
from ...services.user_service_interface import UserServiceInterface
from ...utils.constant_messages import USER_PERMISSION_DENIED, FAILED_TO_CREATE_CHILD, \
    FAILED_TO_UPDATE_CHILD, FAILED_TO_DELETE_CHILD, CHILD_PERMISSION_DENIED, FAILED_TO_RETRIEVE_CHILDREN
from ...utils.enums import Role
from ...utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class UserChildServiceFacade(UserChildServiceFacadeInterface):
    @inject.autoparams()
    def __init__(self, user_service: UserServiceInterface, child_service: ChildServiceInterface):
        self.user_service = user_service
        self.child_service = child_service

    def get_children_by_user_facade(self, user_id: int, role: str) -> List[ChildDto]:
        """
        Facade method to retrieve children based on the user's role, integrating user details into the child DTOs.
        """
        try:
            user_dto = self.user_service.get_user_by_id(user_id)
            if not user_dto:
                raise CustomException(USER_PERMISSION_DENIED)

            children_dtos = self.child_service.get_children_by_user(user_id, role)
            return children_dtos
        except Exception as e:
            logger.error(
                f"[UserChildServiceFacade:get_children_by_user()] Error --> "
                f"Failed to retrieve children for user ID {user_id} with role {role}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_CHILDREN)

    def create_parent_child_serv(self, parent_id: int, child_dto: ChildDto) -> ChildDto:
        """
        Service to create a child record for a parent.
        """
        try:
            # Get user parent
            user = self.user_service.get_user_by_id(parent_id)
            if not user or user.role != Role.PARENT.value:
                raise CustomException(USER_PERMISSION_DENIED)
            # Create the child in the DB and return it
            created_child = self.child_service.create_child_serv(child_dto)
            return created_child
        except Exception as e:
            logger.error(
                f"[user_child_service_facade:create_parent_child_serv()] Error --> creating child for parent ID "
                f"{parent_id}: {e}")
            raise CustomException(FAILED_TO_CREATE_CHILD)

    def update_parent_child_serv(self, parent_id: int, child_dto: ChildDto) -> ChildDto:
        """
        Service to update a child record for a parent.
        """
        try:
            # Get user parent
            user = self.user_service.get_user_by_id(parent_id)
            if not user or user.role not in [Role.PARENT.value, Role.ADMIN.value]:
                raise CustomException(USER_PERMISSION_DENIED)
            # Check if the given child belongs to that parent user
            children = self.child_service.get_children_by_user(parent_id, Role.PARENT.value)
            if not any(child.child_id == child_dto.child_id for child in children):
                raise CustomException(CHILD_PERMISSION_DENIED)
            # Update the child in the DB and return it
            updated_child = self.child_service.update_child_serv(child_dto)
            return updated_child
        except Exception as e:
            logger.error(
                f"[user_child_service_facade:update_parent_child_serv()] Error --> updating child for parent ID "
                f"{parent_id}: {e}")
            raise CustomException(FAILED_TO_UPDATE_CHILD)

    def delete_parent_child_serv(self, parent_id: int, child_dto: ChildDto) -> None:
        """
        Service to delete a child record for a parent.
        """
        try:
            # Get user parent
            user = self.user_service.get_user_by_id(parent_id)
            if not user or user.role != Role.PARENT.value:
                raise CustomException(USER_PERMISSION_DENIED)
            # Check if the given child belongs to that parent user
            children = self.child_service.get_children_by_user(parent_id, Role.PARENT.value)
            if not any(child.child_id == child_dto.child_id for child in children):
                raise CustomException(CHILD_PERMISSION_DENIED)
            # Delete the child from the DB
            self.child_service.delete_child_serv(child_dto)
        except Exception as e:
            logger.error(
                f"[user_child_service_facade:delete_parent_child_serv()] Error --> deleting child for parent ID "
                f"{parent_id}: {e}")
            raise CustomException(FAILED_TO_DELETE_CHILD)
