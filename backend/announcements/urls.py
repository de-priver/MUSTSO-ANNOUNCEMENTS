from django.urls import path
from . import views

urlpatterns = [
    # Announcements
    path('', views.AnnouncementListCreateView.as_view(), name='announcement-list-create'),
    path('<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    path('<int:announcement_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:announcement_id>/like/', views.toggle_like, name='toggle-like'),
    path('<int:announcement_id>/pin/', views.toggle_pin, name='toggle-pin'),
    path('stats/', views.announcement_stats, name='announcement-stats'),
    
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # Hashtags
    path('hashtags/', views.HashtagListView.as_view(), name='hashtag-list'),
]
