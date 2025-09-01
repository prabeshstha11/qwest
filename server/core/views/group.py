from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from core.models.group import Group, Member
from core.serializers.group import GroupSerializer, GroupCreateSerializer

class GroupCreateView(generics.CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupDetailView(generics.RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "groupname"

    def retrieve(self, request, *args, **kwargs):
        try:
            group = self.get_object()
        except:
            raise NotFound("Group not found")

        serializer = self.get_serializer(group)
        data = serializer.data
        data["is_creator"] = (group.created_by == request.user)
        return Response(data)


class MyGroupsView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(members__user=self.request.user).distinct()


class AllGroupsView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Group.objects.all()