import inject
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.dtos.child_dto import ChildDto
from ..models.dtos.questionnaire_dto import QuestionnaireDto
from ..services.facades.user_child_questionnaire_service_facade_interface import \
    UserChildQuestionnaireServiceFacadeInterface
from ..utils.exceptions import CustomException
from ..utils.serializers import QuestionnaireSerializerJsonInput, QuestionnaireSerializerJsonOutput, \
    ChildSerializer


class UserChildQuestionnaireViewSet(viewsets.ViewSet):
    @inject.autoparams()
    def __init__(self, user_questionnaire_facade: UserChildQuestionnaireServiceFacadeInterface, **kwargs):
        super().__init__(**kwargs)
        self.user_questionnaire_facade = user_questionnaire_facade

    @action(detail=False, methods=['get'], url_path='questionnaires')
    def get_questionnaires(self, request):
        """
        Retrieve all questionnaires for the authenticated user based on their role.
        """
        user_id = request.user.id
        try:
            questionnaires = self.user_questionnaire_facade.get_questionnaires_by_user(user_id)
            serializer = QuestionnaireSerializerJsonOutput(questionnaires, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='get-questionnaire')
    def get_questionnaire_by_child(self, request):
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            child_dto = ChildDto(**serializer.validated_data)
            user_id = request.user.id
            try:
                questionnaire_dto = self.user_questionnaire_facade.get_questionnaire_by_child(user_id, child_dto)
                response_serializer = QuestionnaireSerializerJsonOutput(questionnaire_dto)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='create-questionnaire')
    def create_questionnaire(self, request):
        """
        Create a new questionnaire for a child by the authenticated parent.
        """
        parent_id = request.user.id
        serializer = QuestionnaireSerializerJsonInput(data=request.data)
        if serializer.is_valid():
            try:
                questionnaire_dto = QuestionnaireDto(**serializer.validated_data)
                created_questionnaire_dto = self.user_questionnaire_facade.create_questionnaire_facade(parent_id,
                                                                                                       questionnaire_dto)
                response_serializer = QuestionnaireSerializerJsonOutput(created_questionnaire_dto)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='update-questionnaire')
    def update_questionnaire(self, request):
        """
        Update an existing questionnaire for a child by the authenticated parent.
        """
        parent_id = request.user.id
        serializer = QuestionnaireSerializerJsonInput(data=request.data)
        if serializer.is_valid():
            try:
                questionnaire_dto = QuestionnaireDto(**serializer.validated_data)
                updated_questionnaire_dto = self.user_questionnaire_facade.update_questionnaire_facade(parent_id,
                                                                                                       questionnaire_dto)
                response_serializer = QuestionnaireSerializerJsonOutput(updated_questionnaire_dto)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            except CustomException as e:
                return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
