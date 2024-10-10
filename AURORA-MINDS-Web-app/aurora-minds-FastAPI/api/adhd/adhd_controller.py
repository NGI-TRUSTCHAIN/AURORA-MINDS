from fastapi import APIRouter, Depends

from api.adhd.adhd_service import AdhdService
from api.auth.auth_controller import verify_jwt
from api.models.dto_models import AdhdDto, UpdateParentIdRequest
from api.utils.dependency_injection_container import DependencyInjectionContainer

router = APIRouter(prefix="/adhd", dependencies=[Depends(verify_jwt)])
dep_adhd_service = Depends(DependencyInjectionContainer.get_adhd_service)


@router.post("/update-parent-id", response_model=list[AdhdDto])
async def update_parent_id(
        request: UpdateParentIdRequest,
        adhd_service: AdhdService = dep_adhd_service
):
    """
    Endpoint to update the parent ID of ADHD records.
    Checks if the records exist and if the parent IDs are currently null.

    :param request: The request body containing child_id and parent_id
    :param adhd_service: The AdhdService instance
    :return: A list of updated ADHD records as AdhdDto
    """
    return await adhd_service.update_parent_id(request.child_id, request.parent_id)
