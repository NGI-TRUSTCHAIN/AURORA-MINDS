import inject
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.dtos.child_dto import ChildDto
from ..services.child_service_interface import ChildServiceInterface
from ..utils.constant_messages import CHILD_DELETED_SUCCESSFULLY
from ..utils.exceptions import CustomException
from ..utils.serializers import ChildSerializer


class ChildViewSet(viewsets.ViewSet):
    @inject.autoparams()
    def __init__(self, child_service: ChildServiceInterface, **kwargs):
        super().__init__(**kwargs)
        self.child_service = child_service

    # TODO 03A: the following APIs might not be needed for prod since Facade exist

    @action(detail=False, methods=['get'], url_path='list')
    def list_children_by_user(self, request):
        user_id = request.user.id
        user_role = request.user.role
        try:
            children_dtos = self.child_service.get_children_by_user(user_id, user_role)
            response_serializer = ChildSerializer(children_dtos, many=True)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='add')
    def add_child(self, request):
        """
        Create a new child record.
        """
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            try:
                child_dto = ChildDto(**serializer.validated_data)
                created_child_dto = self.child_service.create_child_serv(child_dto)
                response_serializer = ChildSerializer(created_child_dto)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # HTML Django response

    @action(detail=False, methods=['post'], url_path='update')
    def update_child(self, request):
        """
        Update an existing child record.
        """
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            try:
                child_dto = ChildDto(**serializer.validated_data)
                updated_child_dto = self.child_service.update_child_serv(child_dto)
                response_serializer = ChildSerializer(updated_child_dto)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='delete')
    def delete_child(self, request):
        """
        Delete a child record.
        """
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            child_dto = ChildDto(**serializer.validated_data)
            try:
                self.child_service.delete_child_serv(child_dto)
                response_message = CHILD_DELETED_SUCCESSFULLY.format(child_dto.child_id)
                return Response({"Message": response_message},
                                status=status.HTTP_204_NO_CONTENT)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
