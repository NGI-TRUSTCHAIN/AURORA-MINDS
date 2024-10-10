import inject
from django.apps import AppConfig


class AppConfig(AppConfig):
    """
    Django application configuration class.
    """
    name = 'app'

    def ready(self):
        """
        Configure dependency injection bindings.
        Even if we use the '@inject_autoparams()', this configuration step is still necessary to tell
        the inject library how to resolve the INTERFACES to their concrete implementations.
        """
        # User
        from .repositories.user_repository import UserRepository
        from .repositories.user_repository_interface import UserRepositoryInterface
        from .services.user_service import UserService
        from .services.user_service_interface import UserServiceInterface
        # Child
        from .repositories.child_repository import ChildRepository
        from .repositories.child_repository_interface import ChildRepositoryInterface
        from .services.child_service import ChildService
        from .services.child_service_interface import ChildServiceInterface
        # ADHD
        from .repositories.adhd_repository import AdhdRepository
        from .repositories.adhd_repository_interface import AdhdRepositoryInterface
        from .services.adhd_service import AdhdService
        from .services.adhd_service_interface import AdhdServiceInterface
        # Questionnaire
        from .repositories.questionnaire_repository import QuestionnaireRepository
        from .repositories.questionnaire_repository_interface import QuestionnaireRepositoryInterface
        from .services.questionnaire_service import QuestionnaireService
        from .services.questionnaire_service_interface import QuestionnaireServiceInterface
        # User-Child
        from .services.facades.user_child_service_facade import UserChildServiceFacade
        from .services.facades.user_child_service_facade_interface import UserChildServiceFacadeInterface
        # User-ADHD
        from .services.facades.user_child_adhd_service_facade import UserChildAdhdServiceFacade
        from .services.facades.user_child_adhd_service_facade_interface import UserChildAdhdServiceFacadeInterface
        # User-Questionnaire
        from .services.facades.user_child_questionnaire_service_facade import UserChildQuestionnaireServiceFacade
        from .services.facades.user_child_questionnaire_service_facade_interface import \
            UserChildQuestionnaireServiceFacadeInterface
        # Cookie Auth
        from .services.facades.cookie_auth_service import CookieAuthService
        from .services.facades.cookie_auth_service_interface import CookieAuthServiceInterface

        def config(binder):
            # Bind User Interfaces
            binder.bind(UserRepositoryInterface, UserRepository)
            binder.bind_to_constructor(UserServiceInterface,
                                       lambda: UserService(inject.instance(UserRepositoryInterface)))
            # Bind Child Interfaces
            binder.bind(ChildRepositoryInterface, ChildRepository)
            binder.bind_to_constructor(ChildServiceInterface,
                                       lambda: ChildService(inject.instance(ChildRepositoryInterface)))
            # Bind ADHD Interfaces
            binder.bind(AdhdRepositoryInterface, AdhdRepository)
            binder.bind_to_constructor(AdhdServiceInterface,
                                       lambda: AdhdService(inject.instance(AdhdRepositoryInterface)))
            # Bind Questionnaire Interfaces
            binder.bind(QuestionnaireRepositoryInterface, QuestionnaireRepository)
            binder.bind_to_constructor(QuestionnaireServiceInterface,
                                       lambda: QuestionnaireService(inject.instance(QuestionnaireRepositoryInterface)))
            # Bind User-Child Facade Interface
            binder.bind_to_constructor(UserChildServiceFacadeInterface, lambda: UserChildServiceFacade(
                inject.instance(UserServiceInterface),
                inject.instance(ChildServiceInterface)
            ))
            # Bind User-ADHD Facade Interface
            binder.bind_to_constructor(UserChildAdhdServiceFacadeInterface, lambda: UserChildAdhdServiceFacade(
                inject.instance(UserServiceInterface),
                inject.instance(ChildServiceInterface),
                inject.instance(AdhdServiceInterface)
            ))
            # Bind User-Questionnaire Facade Interface
            binder.bind_to_constructor(UserChildQuestionnaireServiceFacadeInterface,
                                       lambda: UserChildQuestionnaireServiceFacade(
                                           inject.instance(UserServiceInterface),
                                           inject.instance(ChildServiceInterface),
                                           inject.instance(QuestionnaireServiceInterface)
                                       ))
            # Bind Cookie Auth Facade Interface
            binder.bind_to_constructor(CookieAuthServiceInterface,
                                       lambda: CookieAuthService(inject.instance(UserRepositoryInterface)))

        inject.configure_once(config)  # Ensure it configures only once
