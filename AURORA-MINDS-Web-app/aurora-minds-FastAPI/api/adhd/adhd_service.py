import logging
from typing import Optional

from fastapi import HTTPException, status

from api.adhd.adhd_repository import AdhdRepository
from api.models.dto_models import AdhdDto

logger = logging.getLogger(__name__)


class AdhdService:
    """
    Service layer for ADHD-related operations, encapsulating business logic
    and interacting with the repository layer.
    """

    def __init__(self, adhd_repository: AdhdRepository):
        """
        Initialize AdhdService with a repository instance.

        :param adhd_repository: An instance of AdhdRepository
        """
        self.adhd_repository = adhd_repository

    async def update_parent_id(self, child_id: int, parent_id: Optional[int]) -> list[AdhdDto]:
        """
        Update the parent ID of ADHD records that belong to the given child ID if conditions are met.

        :param child_id: The child ID to match
        :param parent_id: The new parent ID to update, can be None
        :return: A list of updated ADHD records as AdhdDto
        :raises HTTPException: If no ADHD records are found or if parent IDs are already set
        """
        try:
            # Retrieve all ADHD records for the given child ID
            adhd_records = await self.adhd_repository.get_adhd_records_by_child_id(child_id)
            if not adhd_records:
                logger.error(f"No ADHD records found for child ID {child_id}.")
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail="No ADHD records found for the given child ID")
            if parent_id is not None:
                # Filter records where parent_id is None
                records_to_update = [record for record in adhd_records if record.parent_id is None]
                if not records_to_update:
                    logger.error(f"All ADHD records for child ID {child_id} are already occupied.")
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                        detail="All ADHD records for the given child ID are already occupied")
                # Update the filtered records with the new parent_id
                updated_records = await self.adhd_repository.update_parent_ids(records_to_update, parent_id)
            else:
                # If parent_id is None, update all records (free them from the parent)
                updated_records = await self.adhd_repository.update_parent_ids(adhd_records, parent_id)
            # Convert updated records to AdhdDto and return
            return [AdhdDto.from_orm(record) for record in updated_records]
        except HTTPException as e:
            raise e
        except Exception as e:
            logger.error(f"Error updating ADHD records for child ID {child_id}: {e}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to update ADHD records")
