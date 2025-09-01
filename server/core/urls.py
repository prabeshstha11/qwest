from django.urls import path
from core.views.user import RegisterView, LoginView, LogoutView, CustomTokenRefreshView, profile_view

urlpatterns = [

    # user authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path("me/", profile_view, name="profie_view")

    # create group

    # create post
]