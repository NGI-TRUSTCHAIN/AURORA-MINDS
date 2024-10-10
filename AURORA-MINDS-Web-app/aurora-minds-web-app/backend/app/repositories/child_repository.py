from typing import List

from ..models.dtos.child_dto import ChildDto
from ..models.entities.child import Child
from ..models.entities.user import User
from ..repositories.child_repository_interface import ChildRepositoryInterface


class ChildRepository(ChildRepositoryInterface):

    @staticmethod
    def find_children_by_parent_id(parent_id: int) -> List[Child]:
        """
        Retrieve children records for a specific parent.
        """
        return Child.objects.filter(parent_id=parent_id).all()

    @staticmethod
    def find_children_by_clinician_id(clinician_id: int) -> List[Child]:
        """
        Retrieve children records for a specific clinician.
        """
        return Child.objects.filter(clinician_id=clinician_id).all()

    @staticmethod
    def create_child_rep(child_dto: ChildDto) -> Child:
        """
        Create a new child record in the database.
        Ignoring creating fields that given null from ChildDto.
        """
        # Convert parent_id and clinician_id to User instances
        parent = User.objects.get(pk=child_dto.parent_id.id) if child_dto.parent_id else None
        clinician = User.objects.get(pk=child_dto.clinician_id.id) if child_dto.clinician_id else None

        child_fields = {key: value for key, value in child_dto.__dict__.items() if value is not None}
        child_fields['parent_id'] = parent
        child_fields['clinician_id'] = clinician

        child = Child.objects.create(**child_fields)
        return child

    @staticmethod
    def update_child_rep(child_dto: ChildDto) -> Child:
        """
        Update an existing child record in the database.
        """
        child = Child.objects.get(pk=child_dto.child_id)
        for key, value in child_dto.__dict__.items():
            if value is not None:
                setattr(child, key, value)
        child.save()
        return child

    @staticmethod
    def delete_child_rep(child_id: int) -> None:
        """
        Delete a child record from the database.
        """
        child = Child.objects.get(pk=child_id)
        child.delete()
