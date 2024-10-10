import inject
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..services.facades.user_child_adhd_service_facade_interface import UserChildAdhdServiceFacadeInterface
from ..utils.exceptions import CustomException
from ..utils.serializers import AdhdSerializerJsonOutput


class UserChildAdhdViewSet(viewsets.ViewSet):
    @inject.autoparams()
    def __init__(self, user_adhd_service_facade: UserChildAdhdServiceFacadeInterface, **kwargs):
        super().__init__(**kwargs)
        self.user_adhd_service_facade = user_adhd_service_facade

    @action(detail=False, methods=['get'], url_path='adhd-records')
    def get_adhd_records(self, request):
        """
        Retrieve ADHD records for the authenticated user.
        """
        user_id = request.user.id
        try:
            adhd_records = self.user_adhd_service_facade.get_adhd_records_for_user(user_id)
            serializer = AdhdSerializerJsonOutput(adhd_records, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
