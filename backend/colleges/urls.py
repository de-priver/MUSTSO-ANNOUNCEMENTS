from django.urls import path
from . import views

urlpatterns = [
    path('', views.CollegeListCreateView.as_view(), name='college-list-create'),
    path('<int:pk>/', views.CollegeDetailView.as_view(), name='college-detail'),
    path('<int:college_id>/departments/', views.DepartmentListCreateView.as_view(), name='department-list-create'),
    path('departments/', views.DepartmentListCreateView.as_view(), name='all-departments'),
    path('departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    path('stats/', views.college_stats, name='college-stats'),
]
