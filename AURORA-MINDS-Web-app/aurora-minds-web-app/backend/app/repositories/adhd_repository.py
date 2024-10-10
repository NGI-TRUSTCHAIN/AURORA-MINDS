from ..models.dtos.adhd_dto import AdhdDto
from ..models.entities.adhd import Adhd
from ..repositories.adhd_repository_interface import AdhdRepositoryInterface


class AdhdRepository(AdhdRepositoryInterface):
    @staticmethod
    def find_adhd_records_by_child_ids(child_ids: list) -> list[Adhd]:
        """
        Retrieve ADHD records for a list of child IDs.

        Args:
            child_ids (list): List of child IDs.

        Returns:
            list: List of ADHD records.
        """
        return Adhd.objects.filter(child_id__in=child_ids)

    @staticmethod
    def create_adhd_record_rep(adhd_dto: AdhdDto) -> Adhd:
        adhd = Adhd.objects.create(**adhd_dto.__dict__)
        return adhd

    @staticmethod
    def update_adhd_record_rep(adhd_dto: AdhdDto) -> Adhd:
        """
        Update an existing ADHD record in the database.
        """
        adhd = Adhd.objects.get(pk=adhd_dto.adhd_id)
        for key, value in adhd_dto.__dict__.items():
            if value is not None:
                setattr(adhd, key, value)
        adhd.save()
        return adhd
