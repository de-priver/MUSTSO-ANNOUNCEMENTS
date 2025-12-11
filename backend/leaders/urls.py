from django.urls import path
from . import views

urlpatterns = [
    path('', views.LeaderListCreateView.as_view(), name='leader-list-create'),
    path('<int:pk>/', views.LeaderDetailView.as_view(), name='leader-detail'),
    path('stats/', views.leader_stats, name='leader-stats'),
]
