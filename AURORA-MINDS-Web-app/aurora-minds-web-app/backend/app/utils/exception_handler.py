import traceback

from django.http import JsonResponse


class ExceptionHandlerMiddleware:
    """
    Middleware to catch exceptions and return a JSON response.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            # Log the exception traceback
            traceback.print_exc()
            # Return a JSON response with the error details
            return JsonResponse(
                {'error': e.__class__.__name__, 'message': str(e)},
                status=500
            )
