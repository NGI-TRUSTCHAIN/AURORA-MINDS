"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from app.views.adhd_viewset import AdhdViewSet
from app.views.user_child_adhd_viewset import UserChildAdhdViewSet
from app.views.user_child_questionnaire_viewset import UserChildQuestionnaireViewSet
from app.views.user_child_viewset import UserChildViewSet
from app.views.user_viewset import UserViewSet
from app.views.cookie_auth_viewset import CookieAuthViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()

""" REGISTER HERE """
# A. API Link: ' /users/"name of the method in user_viewset.py" '
# B. The Controller class the route is referred to
# C. For distinguishing purposes with other routes (give it a name)
router.register(r'users', UserViewSet, basename='user')
router.register(r'cookie-auth', CookieAuthViewSet, basename='cookie_auth')

urlpatterns = [
    # User API Endpoints
    path('', include(router.urls)),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/list-users-by-role', UserViewSet.as_view({'post': 'list_users_by_role'}), name='list_users_by_role'),
    path('users/get-user', UserViewSet.as_view({'post': 'get_user'}), name='get_user'),
    # Child API Endpoints
    # TODO 03B: the following APIs might not be needed for prod since Facade exist
    # path('children/list', ChildViewSet.as_view({'get': 'list_children_by_user'}), name='list_children_by_user'),
    # path('children/add', ChildViewSet.as_view({'post': 'add_child'}), name='create_child'),
    # path('children/update', ChildViewSet.as_view({'post': 'update_child'}), name='update_child'),
    # path('children/delete', ChildViewSet.as_view({'post': 'delete_child'}), name='delete_child'),
    # Parent-Child API Endpoints
    path('users/children-records', UserChildViewSet.as_view({'get': 'list_children_by_user'}),
         name='list_children_by_user'),
    path('users/create-parent-child', UserChildViewSet.as_view({'post': 'create_parent_child'}),
         name='create_parent_child'),
    path('users/update-parent-child', UserChildViewSet.as_view({'post': 'update_parent_child'}),
         name='update_parent_child'),
    path('users/delete-parent-child', UserChildViewSet.as_view({'post': 'delete_parent_child'}),
         name='delete_parent_child'),
    # ADHD API Endpoints
    path('adhd/create', AdhdViewSet.as_view({'post': 'create_adhd_record'}), name='create_adhd_record'),
    path('adhd/update', AdhdViewSet.as_view({'post': 'update_adhd_record'}), name='update_adhd_record'),
    # Parent-Child-ADHD Endpoints
    path('users/adhd-records', UserChildAdhdViewSet.as_view({'get': 'get_adhd_records'}), name='get_adhd_records'),
    # Parent-Child-Questionnaire Endpoints
    path('users/questionnaires', UserChildQuestionnaireViewSet.as_view({'get': 'get_questionnaires'}),
         name='get_questionnaires'),
    path('users/get-questionnaire', UserChildQuestionnaireViewSet.as_view({'post': 'get_questionnaire_by_child'}),
         name='get_questionnaire_by_child'),
    path('users/create-questionnaire', UserChildQuestionnaireViewSet.as_view({'post': 'create_questionnaire'}),
         name='create_questionnaire'),
    path('users/update-questionnaire', UserChildQuestionnaireViewSet.as_view({'post': 'update_questionnaire'}),
         name='update_questionnaire')
]
