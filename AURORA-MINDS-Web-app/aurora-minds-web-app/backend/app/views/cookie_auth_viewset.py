import json
import logging

import inject
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..services.facades.cookie_auth_service_interface import CookieAuthServiceInterface
from ..utils.exceptions import CustomException

logger = logging.getLogger(__name__)


class CookieAuthViewSet(viewsets.ViewSet):
    """
    ViewSet to handle user authentication via cookie.
    """

    permission_classes = [AllowAny]

    @inject.autoparams()
    def __init__(self, cookie_auth_service: CookieAuthServiceInterface, *args, **kwargs):
        """
        Initialize the CookieAuthViewSet with a CookieAuthService instance.

        Args:
            cookie_auth_service (CookieAuthServiceInterface): The cookie authentication service instance.
        """
        super().__init__(*args, **kwargs)
        self.cookie_auth_service = cookie_auth_service

    @action(detail=False, methods=['post'], url_path='authenticate')
    def authenticate_with_cookie(self, request):
        """
        Handle POST request to authenticate a user via cookie.

        Args:
            request: The HTTP request containing the cookie.

        Returns:
            Response: HTTP response with token if authentication is successful, otherwise an error message.
        """
        cookie = request.data.get('cookie')

        if not cookie:
            return Response({"error": "No cookie found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cookie_data = json.loads(cookie)
            result = self.cookie_auth_service.authenticate_with_cookie(cookie_data)
            return Response({
                "user": result['user'],
                "access": result['access'],
                "refresh": result['refresh'],
            }, status=status.HTTP_200_OK)
        except CustomException as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding cookie: {e}")
            return Response({"error": "Invalid cookie format"}, status=status.HTTP_400_BAD_REQUEST)
