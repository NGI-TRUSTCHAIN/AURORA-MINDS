from typing import Optional

from sqlalchemy import update
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from api.models.db_models import ADHD


class AdhdRepository:
    def __init__(self, session: Session):
        self.session = session

    async def get_adhd_records_by_child_id(self, child_id: int):
        """
        Retrieve ADHD records by child ID from the database.

        :param child_id: The child ID of the ADHD records to retrieve
        :return: A list of ADHD records that belong to the given child ID
        """
        async with self.session() as session:
            async_result = await session.execute(select(ADHD).filter(ADHD.child_id == child_id))
            return async_result.scalars().all()

    async def update_parent_ids(self, adhd_records, parent_id: Optional[int]):
        """
        Update the parent ID of multiple ADHD records.

        :param adhd_records: The ADHD records to update
        :param parent_id: The new parent ID to set
        :return: The updated ADHD records
        """
        async with self.session() as session:
            # Extract the IDs of the ADHD records to be updated
            adhd_ids = [record.adhd_id for record in adhd_records]
            # Perform a bulk update on all ADHD records that match the given IDs
            await session.execute(
                update(ADHD)
                .where(ADHD.adhd_id.in_(adhd_ids))
                .values(parent_id=parent_id)
            )
            # Commit the changes to the database
            await session.commit()
            # Retrieve all the updated ADHD records in a single query
            async_result = await session.execute(select(ADHD).filter(ADHD.adhd_id.in_(adhd_ids)))
            return async_result.scalars().all()
