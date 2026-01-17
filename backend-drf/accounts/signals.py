from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def assign_default_role(sender, instance, created, **kwargs):
    if created:
        user_group = Group.objects.get(name="User")
        instance.groups.add(user_group)
