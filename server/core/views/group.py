from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from core.models.group import Group, Member
from core.serializers.group import GroupSerializer, GroupCreateSerializer

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

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
    

class JoinGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, groupname):
        group = get_object_or_404(Group, groupname=groupname)

        if group.created_by == request.user:
            return Response({"detail": "You are the creator, already a member."}, status=status.HTTP_400_BAD_REQUEST)

        if Member.objects.filter(user=request.user, group=group).exists():
            return Response({"detail": "You are already a member."}, status=status.HTTP_400_BAD_REQUEST)

        Member.objects.create(user=request.user, group=group)
        return Response({"detail": "Joined group successfully."}, status=status.HTTP_200_OK)
    
class LeaveGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, groupname):
        group = get_object_or_404(Group, groupname=groupname)

        if group.created_by == request.user:
            return Response({"detail": "Creator cannot leave the group."}, status=status.HTTP_400_BAD_REQUEST)

        membership = Member.objects.filter(user=request.user, group=group).first()
        if not membership:
            return Response({"detail": "You are not a member."}, status=status.HTTP_400_BAD_REQUEST)

        membership.delete()
        return Response({"detail": "Left group successfully."}, status=status.HTTP_200_OK)
