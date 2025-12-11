from django.contrib import admin
from .models import Leader, LeaderAchievement


class LeaderAchievementInline(admin.TabularInline):
    model = LeaderAchievement
    extra = 1
    ordering = ['order']


@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'department', 'team_size', 'join_date']
    list_filter = ['department', 'join_date']
    search_fields = ['name', 'position', 'department', 'description']
    inlines = [LeaderAchievementInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'position', 'department', 'image')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'location')
        }),
        ('Professional Details', {
            'fields': ('description', 'join_date', 'team_size')
        }),
    )


@admin.register(LeaderAchievement)
class LeaderAchievementAdmin(admin.ModelAdmin):
    list_display = ['leader', 'achievement_preview', 'order']
    list_filter = ['leader']
    search_fields = ['leader__name', 'achievement']
    ordering = ['leader', 'order']
    
    def achievement_preview(self, obj):
        return obj.achievement[:50] + '...' if len(obj.achievement) > 50 else obj.achievement
    achievement_preview.short_description = 'Achievement Preview'
