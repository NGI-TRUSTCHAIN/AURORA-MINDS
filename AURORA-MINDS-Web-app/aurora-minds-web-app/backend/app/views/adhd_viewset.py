import inject
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.dtos.adhd_dto import AdhdDto
from ..services.adhd_service_interface import AdhdServiceInterface
from ..utils.enums import Role
from ..utils.exceptions import CustomException
from ..utils.serializers import AdhdSerializerJsonInput, AdhdSerializerJsonOutput


class AdhdViewSet(viewsets.ViewSet):
    @inject.autoparams()
    def __init__(self, adhd_service: AdhdServiceInterface, **kwargs):
        super().__init__(**kwargs)
        self.adhd_service = adhd_service

    @action(detail=False, methods=['post'], url_path='create')
    def create_adhd_record(self, request):
        if request.user.role != Role.PARENT.value:
            return Response({"Message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = AdhdSerializerJsonInput(data=request.data)
        if serializer.is_valid():
            try:
                adhd_dto = AdhdDto(**serializer.validated_data)
                created_adhd = self.adhd_service.create_adhd_record_serv(adhd_dto)
                return Response(AdhdSerializerJsonOutput(created_adhd).data, status=status.HTTP_201_CREATED)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='update')
    def update_adhd_record(self, request):
        """
        Update an existing ADHD record.
        """
        if request.user.role != Role.ADMIN.value:
            return Response({"Message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = AdhdSerializerJsonInput(data=request.data)
        if serializer.is_valid():
            try:
                adhd_dto = AdhdDto(**serializer.validated_data)
                updated_adhd = self.adhd_service.update_adhd_record_serv(adhd_dto)
                return Response(AdhdSerializerJsonOutput(updated_adhd).data, status=status.HTTP_200_OK)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
