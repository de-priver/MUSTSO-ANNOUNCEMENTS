from rest_framework import serializers
from .models import College, Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'leader_name', 'email', 'phone']


class CollegeSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = College
        fields = ['id', 'name', 'leader_name', 'leader_image', 'departments']


class CollegeCreateUpdateSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, required=False)
    
    class Meta:
        model = College
        fields = ['name', 'leader_name', 'leader_image', 'departments']
    
    def create(self, validated_data):
        departments_data = validated_data.pop('departments', [])
        college = College.objects.create(**validated_data)
        
        for dept_data in departments_data:
            Department.objects.create(college=college, **dept_data)
        
        return college
    
    def update(self, instance, validated_data):
        departments_data = validated_data.pop('departments', [])
        
        # Update college fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update departments
        if departments_data:
            instance.departments.all().delete()
            for dept_data in departments_data:
                Department.objects.create(college=instance, **dept_data)
        
        return instance


class DepartmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name', 'leader_name', 'email', 'phone', 'college']
