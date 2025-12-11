from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Leader
from .serializers import LeaderSerializer, LeaderCreateUpdateSerializer


class LeaderListCreateView(generics.ListCreateAPIView):
    queryset = Leader.objects.all().select_related('college')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'position', 'college', 'is_cabinet']
    search_fields = ['name', 'position', 'department', 'description']
    ordering_fields = ['name', 'join_date', 'team_size']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LeaderCreateUpdateSerializer
        return LeaderSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class LeaderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Leader.objects.all().select_related('college')
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return LeaderCreateUpdateSerializer
        return LeaderSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def leader_stats(request):
    total_leaders = Leader.objects.count()
    departments = Leader.objects.values_list('department', flat=True).distinct()
    department_counts = {}
    
    for department in departments:
        department_counts[department] = Leader.objects.filter(department=department).count()
    
    total_team_size = sum(Leader.objects.values_list('team_size', flat=True))
    
    return Response({
        'total_leaders': total_leaders,
        'total_team_size': total_team_size,
        'department_counts': department_counts,
        'departments': list(departments)
    })
