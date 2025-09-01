from django.db import models
from django.utils import timezone
from django.conf import settings

class Group(models.Model):
    groupname = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="groups_created"
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.groupname


class Member(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memberships"
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="members"
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("user", "group")

    def __str__(self):
        return f"{self.user.username} in {self.group.groupname}"
