from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import your custom user model

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {"fields": ("is_customer", "is_owner")}),
    )
    list_display = ("username", "email", "is_customer", "is_owner", "is_staff", "is_superuser")
    list_filter = ("is_customer", "is_owner", "is_staff", "is_superuser")

