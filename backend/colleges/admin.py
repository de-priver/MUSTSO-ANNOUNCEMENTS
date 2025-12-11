from django.contrib import admin
from .models import College, Department


class DepartmentInline(admin.TabularInline):
    model = Department
    extra = 1


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ['name', 'leader_name', 'department_count']
    search_fields = ['name', 'leader_name']
    inlines = [DepartmentInline]
    
    def department_count(self, obj):
        return obj.departments.count()
    department_count.short_description = 'Number of Departments'


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'college', 'leader_name', 'email', 'phone']
    list_filter = ['college']
    search_fields = ['name', 'leader_name', 'college__name']
