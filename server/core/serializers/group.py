from rest_framework import serializers
from core.models.group import Group, Member

class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "id",
            "groupname",
            "description",
            "category",
            "is_private",
            "created_by",
            "created_at",
            "members",
        ]

    def get_members(self, obj):
        return [member.user.username for member in obj.members.all()]


class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["groupname", "description", "category", "is_private"]

    def create(self, validated_data):
        user = self.context["request"].user
        group = Group.objects.create(created_by=user, **validated_data)
        Member.objects.create(user=user, group=group)
        return group
