import logging
from typing import List

import inject
from auto_dataclass.dj_model_to_dataclass import FromOrmToDataclass

from ..models.dtos.adhd_dto import AdhdDto
from ..repositories.adhd_repository_interface import AdhdRepositoryInterface
from ..services.adhd_service_interface import AdhdServiceInterface
from ..utils.constant_messages import FAILED_TO_RETRIEVE_ADHD_RECORDS, FAILED_TO_UPDATE_ADHD_RECORD, \
    FAILED_TO_CREATE_ADHD_RECORD
from ..utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class AdhdService(AdhdServiceInterface):
    @inject.autoparams()
    def __init__(self, adhd_repository: AdhdRepositoryInterface):
        self.adhd_repository = adhd_repository
        self.converter = FromOrmToDataclass()

    def get_adhd_records_by_child_ids(self, child_ids: List[int]) -> List[AdhdDto]:
        """
        Service to retrieve ADHD records for a list of child IDs.

        Args:
            child_ids (list): List of child IDs.

        Returns:
            list: List of ADHD DTOs.
        """
        try:
            adhd_records = self.adhd_repository.find_adhd_records_by_child_ids(child_ids)
            return [self.converter.to_dto(adhd, AdhdDto) for adhd in adhd_records]
        except Exception as e:
            logger.error(
                f"[adhd_service:get_adhd_records_by_child_ids()] Error --> Failed to retrieve ADHD records "
                f"for child IDs {child_ids}: {e}")
            raise CustomException(FAILED_TO_RETRIEVE_ADHD_RECORDS)

    def create_adhd_record_serv(self, adhd_dto: AdhdDto) -> AdhdDto:
        """
        Service to create a new ADHD record.
        """
        try:
            adhd = self.adhd_repository.create_adhd_record_rep(adhd_dto)
            return self.converter.to_dto(adhd, AdhdDto)
        except Exception as e:
            logger.error(
                f"[adhd_service:create_adhd_record_serv()] Error --> Failed to create ADHD record: {e}")
            raise CustomException(FAILED_TO_CREATE_ADHD_RECORD)

    def update_adhd_record_serv(self, adhd_dto: AdhdDto) -> AdhdDto:
        """
        Service to update an existing ADHD record.
        """
        try:
            adhd = self.adhd_repository.update_adhd_record_rep(adhd_dto)
            return self.converter.to_dto(adhd, AdhdDto)
        except Exception as e:
            logger.error(
                f"[adhd_service:update_adhd_record()] Error --> Failed to update ADHD record with ID {adhd_dto.adhd_id}: {e}")
            raise CustomException(FAILED_TO_UPDATE_ADHD_RECORD)
