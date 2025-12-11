from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserActivity, UserNotification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'department', 'is_active', 'date_joined']
    list_filter = ['role', 'department', 'is_active', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name', 'username']
    ordering = ['email']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'location', 'department', 'position', 'join_date', 'bio', 'avatar', 'role')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'location', 'department', 'position', 'role')
        }),
    )


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'title', 'timestamp']
    list_filter = ['type', 'timestamp']
    search_fields = ['user__email', 'title']
    readonly_fields = ['timestamp']


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'read', 'timestamp']
    list_filter = ['read', 'timestamp']
    search_fields = ['user__email', 'title']
    readonly_fields = ['timestamp']
