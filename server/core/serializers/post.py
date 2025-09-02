from rest_framework import serializers
from core.models.post import Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    group = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "group",
            "author",
            "created_at",
            "updated_at",
        ]


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["title", "description"]

    def create(self, validated_data):
        user = self.context["request"].user
        group = self.context.get("group")
        post = Post.objects.create(author=user, group=group, **validated_data)
        return post
