import inject
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.dtos.child_dto import ChildDto
from ..services.facades.user_child_service_facade_interface import UserChildServiceFacadeInterface
from ..utils.constant_messages import CHILD_DELETED_SUCCESSFULLY
from ..utils.exceptions import CustomException
from ..utils.serializers import ChildSerializer, ChildSerializerWithUserDto


class UserChildViewSet(viewsets.ViewSet):
    @inject.autoparams()
    def __init__(self, user_child_service_facade: UserChildServiceFacadeInterface, **kwargs):
        super().__init__(**kwargs)
        self.user_child_service_facade = user_child_service_facade

    @action(detail=False, methods=['get'], url_path='children-records')
    def list_children_by_user(self, request):
        """
        Retrieve children based on the logged-in user's role.
        """
        user_id = request.user.id
        role = request.user.role
        try:
            children_dtos = self.user_child_service_facade.get_children_by_user_facade(user_id, role)
            serializer = ChildSerializerWithUserDto(children_dtos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='create-parent-child')
    def create_parent_child(self, request):
        """
        Create a child record for a parent.
        """
        parent_id = request.user.id  # ensure that we work with the actual parent
        serializer = ChildSerializer(data=request.data)  # includes the json arguments parent_id and clinician_id
        if serializer.is_valid():
            try:
                child_dto = ChildDto(**serializer.validated_data)
                created_child_dto = self.user_child_service_facade.create_parent_child_serv(parent_id, child_dto)
                response_serializer = ChildSerializerWithUserDto(created_child_dto)  # return with parent & clinic dtos
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='update-parent-child')
    def update_parent_child(self, request):
        """
        Update a child record for a parent.
        """
        parent_id = request.user.id  # parent_id is the same as user id
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            try:
                child_dto = ChildDto(**serializer.validated_data)
                updated_child_dto = self.user_child_service_facade.update_parent_child_serv(parent_id, child_dto)
                response_serializer = ChildSerializerWithUserDto(updated_child_dto)  # return with parent & clinic dtos
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='delete-parent-child')
    def delete_parent_child(self, request):
        """
        Delete a child record for a parent.
        """
        parent_id = request.user.id  # parent_id is the same as user id
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            try:
                child_dto = ChildDto(**serializer.validated_data)
                self.user_child_service_facade.delete_parent_child_serv(parent_id, child_dto)
                response_message = CHILD_DELETED_SUCCESSFULLY.format(child_dto.child_id)
                return Response({"Message": response_message}, status=status.HTTP_204_NO_CONTENT)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
