from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import College, Department
from .serializers import (
    CollegeSerializer, CollegeCreateUpdateSerializer,
    DepartmentSerializer, DepartmentCreateUpdateSerializer
)


class CollegeListCreateView(generics.ListCreateAPIView):
    queryset = College.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'leader_name']
    ordering_fields = ['name']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CollegeCreateUpdateSerializer
        return CollegeSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class CollegeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = College.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CollegeCreateUpdateSerializer
        return CollegeSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class DepartmentListCreateView(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['college']
    search_fields = ['name', 'leader_name']
    ordering_fields = ['name']
    ordering = ['name']
    
    def get_queryset(self):
        college_id = self.kwargs.get('college_id')
        if college_id:
            return Department.objects.filter(college_id=college_id)
        return Department.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DepartmentCreateUpdateSerializer
        return DepartmentSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DepartmentCreateUpdateSerializer
        return DepartmentSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def college_stats(request):
    total_colleges = College.objects.count()
    total_departments = Department.objects.count()
    
    college_dept_counts = {}
    for college in College.objects.all():
        college_dept_counts[college.name] = college.departments.count()
    
    return Response({
        'total_colleges': total_colleges,
        'total_departments': total_departments,
        'college_department_counts': college_dept_counts
    })
