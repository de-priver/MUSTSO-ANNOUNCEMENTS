from django.contrib import admin
from .models import Category, Hashtag, Announcement, Comment, AnnouncementLike


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'is_active', 'created_at', 'created_by']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'created_by']
    ordering = ['name']
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Hashtag)
class HashtagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'usage_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name']
    readonly_fields = ['slug', 'usage_count', 'created_at']
    ordering = ['-usage_count', 'name']


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ['author', 'timestamp']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'timestamp', 'likes', 'is_pinned', 'is_published']
    list_filter = ['category', 'is_pinned', 'is_published', 'timestamp', 'author']
    search_fields = ['title', 'description', 'author__username', 'author__first_name', 'author__last_name']
    readonly_fields = ['timestamp', 'updated_at', 'likes']
    filter_horizontal = ['hashtags']
    date_hierarchy = 'timestamp'
    ordering = ['-timestamp']
    inlines = [CommentInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'author')
        }),
        ('Content', {
            'fields': ('media', 'hashtags')
        }),
        ('Settings', {
            'fields': ('is_pinned', 'is_published')
        }),
        ('Metadata', {
            'fields': ('timestamp', 'updated_at', 'likes'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['announcement', 'author', 'content_preview', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['content', 'author__email', 'announcement__title']
    readonly_fields = ['timestamp']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'


@admin.register(AnnouncementLike)
class AnnouncementLikeAdmin(admin.ModelAdmin):
    list_display = ['announcement', 'user', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['user__email', 'announcement__title']
    readonly_fields = ['timestamp']
