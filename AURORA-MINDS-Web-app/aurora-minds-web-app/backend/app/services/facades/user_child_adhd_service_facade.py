import logging

import inject

from .user_child_adhd_service_facade_interface import UserChildAdhdServiceFacadeInterface
from ...models.dtos.adhd_dto import AdhdDto
from ...services.adhd_service_interface import AdhdServiceInterface
from ...services.child_service_interface import ChildServiceInterface
from ...services.user_service_interface import UserServiceInterface
from ...utils.constant_messages import FAILED_TO_RETRIEVE_USER, FAILED_TO_RETRIEVE_ADHD_RECORDS
from ...utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class UserChildAdhdServiceFacade(UserChildAdhdServiceFacadeInterface):
    @inject.autoparams()
    def __init__(self, user_service: UserServiceInterface, child_service: ChildServiceInterface,
                 adhd_service: AdhdServiceInterface):
        self.user_service = user_service
        self.child_service = child_service
        self.adhd_service = adhd_service

    def get_adhd_records_for_user(self, user_id: int) -> list[AdhdDto]:
        """
        Service to retrieve ADHD records for a user based on their role.

        Args:
            user_id (int): The user ID.

        Returns:
            list: List of ADHD DTOs.
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
            # Get each child's ADHD record storing to a list
            adhd_records = self.adhd_service.get_adhd_records_by_child_ids(child_ids)
            return adhd_records
        except CustomException as e:
            logger.error(f"[user_adhd_service_facade:get_adhd_records_for_user()] Error --> {e}")
            raise e
        except Exception as e:
            logger.error(
                f"[user_adhd_service_facade:get_adhd_records_for_user()] Error --> Failed to retrieve ADHD records "
                f"for user ID {user_id}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_ADHD_RECORDS)
