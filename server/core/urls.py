from django.urls import path
from core.views.user import RegisterView, LoginView, LogoutView, CustomTokenRefreshView, profile_view
from core.views.group import GroupCreateView, GroupDetailView, AllGroupsView, MyGroupsView, JoinGroupView, LeaveGroupView

urlpatterns = [

    # user authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path("me/", profile_view, name="profie_view"),

    # create group
    path("groups/", GroupCreateView.as_view(), name="group-create"),
    path("groups/all/", AllGroupsView.as_view(), name="group-all"),
    path("groups/my/", MyGroupsView.as_view(), name="group-my"),
    path("groups/<str:groupname>/", GroupDetailView.as_view(), name="group-detail"),
    path("groups/<str:groupname>/join/", JoinGroupView.as_view(), name="group-join"),
    path("groups/<str:groupname>/leave/", LeaveGroupView.as_view(), name="group-leave"),

    # create post
]