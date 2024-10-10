import inject
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..models.dtos.user_dto import UserLoginDto
from ..models.dtos.user_dto import UserRegistrationDto
from ..services.user_service_interface import UserServiceInterface
from ..utils.constant_messages import USER_CREATED_SUCCESSFULLY
from ..utils.exceptions import CustomException
from ..utils.serializers import UserSerializer, LoginSerializer, UserDtoSerializer


class UserViewSet(viewsets.ViewSet):
    """
    ViewSet to handle user-related actions such as registration and login.
    """

    permission_classes = [AllowAny]

    @inject.autoparams()
    def __init__(self, user_service: UserServiceInterface, *args, **kwargs):
        """
        Initialize the UserViewSet with a UserService instance.

        Args:
            user_service (UserServiceInterface): The user service instance.
        """
        # super(): Ensures that your class is properly integrated with the 'Django view framework'
        # and any other parent classes it inherits from
        super().__init__(*args, **kwargs)
        self.user_service = user_service

    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Handle POST request to register a new user.

        Args:
            request: The HTTP request containing user data.

        Returns:
            Response: HTTP response indicating the result of the registration.
        """
        serializer = UserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            registered_user_dto = UserRegistrationDto(**serializer.validated_data)
            self.user_service.register_user(registered_user_dto)
            response_message = USER_CREATED_SUCCESSFULLY
            return Response({"message": response_message}, status=status.HTTP_201_CREATED)
        except CustomException as e:
            return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Handle POST request to authenticate a user and generate a token.

        Args:
            request: The HTTP request containing login credentials.

        Returns:
            Response: HTTP response with token if authentication is successful, otherwise an error message.
        """
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            login_user_dto = UserLoginDto(**serializer.validated_data)
            result = self.user_service.authenticate_user(login_user_dto)
            return Response({
                "user": UserSerializer(result['user']).data,
                "access": result['access'],
                "refresh": result['refresh'],
            }, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"error": e.message}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], url_path='list-users-by-role')
    def list_users_by_role(self, request):
        """
        Retrieve users based on the role.
        """
        role = request.data.get('role')
        try:
            users = self.user_service.get_users_by_role(role)
            serializer = UserDtoSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='get-user-by-role')
    def get_user(self, request):
        """
        Retrieve a user based on their ID and role.
        """
        user_id = request.data.get('user_id')
        role = request.data.get('role')
        try:
            user = self.user_service.get_user_by_id_and_role(user_id, role)
            serializer = UserDtoSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
