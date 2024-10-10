from fastapi import Depends

from api.adhd.adhd_repository import AdhdRepository
from api.adhd.adhd_service import AdhdService
from api.utils.database_session_manager import db_manager


class DependencyInjectionContainer:
    """ DO NOT FORGET TO ADD HERE THE DEPENDENCIES WHEN A NEW SERVICE HAS BEEN ADDED """

    # ADHD
    @staticmethod
    def get_adhd_repository() -> AdhdRepository:
        return AdhdRepository(db_manager.get_db)

    @staticmethod
    def get_adhd_service(repository: AdhdRepository = Depends(get_adhd_repository)) -> AdhdService:
        return AdhdService(repository)

    # Add other dependencies here...
