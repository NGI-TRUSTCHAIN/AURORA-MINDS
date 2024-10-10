from abc import ABC, abstractmethod


class CookieAuthServiceInterface(ABC):
    """
    Interface for CookieAuthService
    """

    @abstractmethod
    def authenticate_with_cookie(self, cookie_data: dict):
        pass
