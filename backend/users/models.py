from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_customer = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)

    # verification_code = models.CharField(max_length=4, blank=True, null=True)
    # is_verified = models.BooleanField(default=False)  # To track verification status

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions_set",
        blank=True
    )

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)