from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from core.models.group import Group
from core.models.post import Post
from core.serializers.post import PostSerializer, PostCreateSerializer

class GroupPostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        groupname = self.kwargs["groupname"]
        group = get_object_or_404(Group, groupname=groupname)
        return Post.objects.filter(group=group).order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PostCreateSerializer
        return PostSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        groupname = self.kwargs["groupname"]
        group = get_object_or_404(Group, groupname=groupname)
        context["group"] = group
        return context
