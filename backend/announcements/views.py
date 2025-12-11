from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F, Q
from .models import Announcement, Comment, AnnouncementLike, Category, Hashtag
from .serializers import (
    AnnouncementSerializer, AnnouncementListSerializer,
    AnnouncementCreateUpdateSerializer, CommentSerializer,
    CommentCreateSerializer, AnnouncementLikeSerializer,
    CategorySerializer, CategoryCreateUpdateSerializer, HashtagSerializer
)
from users.models import UserActivity


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CategoryCreateUpdateSerializer
        return CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        # Only admins can create categories
        if self.request.user.role != 'admin':
            return Response(
                {'error': 'Only administrators can create categories'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(created_by=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CategoryCreateUpdateSerializer
        return CategorySerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_update(self, serializer):
        # Only admins can update categories
        if self.request.user.role != 'admin':
            return Response(
                {'error': 'Only administrators can update categories'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only admins can delete categories
        if self.request.user.role != 'admin':
            return Response(
                {'error': 'Only administrators can delete categories'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        # Soft delete by setting is_active to False
        instance.is_active = False
        instance.save()


class HashtagListView(generics.ListAPIView):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'usage_count', 'created_at']
    ordering = ['-usage_count', 'name']


class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.filter(is_published=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author', 'is_pinned']
    search_fields = ['title', 'description', 'author__first_name', 'author__last_name', 'hashtags__name']
    ordering_fields = ['timestamp', 'likes', 'updated_at']
    ordering = ['-is_pinned', '-timestamp']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AnnouncementCreateUpdateSerializer
        return AnnouncementListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by hashtags
        hashtags = self.request.query_params.get('hashtags')
        if hashtags:
            hashtag_list = [h.strip() for h in hashtags.split(',')]
            queryset = queryset.filter(hashtags__name__in=hashtag_list).distinct()
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        return queryset
    
    def perform_create(self, serializer):
        announcement = serializer.save(author=self.request.user)
        # Add user activity
        UserActivity.objects.create(
            user=self.request.user,
            type='post',
            title=f'Posted announcement: {announcement.title}'
        )


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AnnouncementCreateUpdateSerializer
        return AnnouncementSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticatedOrReadOnly()]
    
    def perform_update(self, serializer):
        # Only allow author or admin to update
        if (self.request.user == self.get_object().author or 
            self.request.user.role == 'admin'):
            serializer.save()
        else:
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
    
    def perform_destroy(self, instance):
        # Only allow author or admin to delete
        if (self.request.user == instance.author or 
            self.request.user.role == 'admin'):
            instance.delete()
        else:
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )


class CommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer
    
    def get_queryset(self):
        announcement_id = self.kwargs['announcement_id']
        return Comment.objects.filter(announcement_id=announcement_id)
    
    def perform_create(self, serializer):
        announcement_id = self.kwargs['announcement_id']
        try:
            announcement = Announcement.objects.get(id=announcement_id)
            comment = serializer.save(
                author=self.request.user, 
                announcement=announcement
            )
            # Add user activity
            UserActivity.objects.create(
                user=self.request.user,
                type='comment',
                title=f'Commented on: {announcement.title}'
            )
        except Announcement.DoesNotExist:
            return Response(
                {'error': 'Announcement not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


@api_view(['POST', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, announcement_id):
    try:
        announcement = Announcement.objects.get(id=announcement_id)
        like, created = AnnouncementLike.objects.get_or_create(
            announcement=announcement,
            user=request.user
        )
        
        if created:
            # Like was created
            # Add user activity
            UserActivity.objects.create(
                user=request.user,
                type='like',
                title=f'Liked: {announcement.title}'
            )
            action = 'liked'
        else:
            # Like already existed, remove it
            like.delete()
            action = 'unliked'
        
        # Recalculate likes count based on actual AnnouncementLike records
        actual_likes_count = AnnouncementLike.objects.filter(announcement=announcement).count()
        Announcement.objects.filter(id=announcement_id).update(likes=actual_likes_count)
        
        return Response({
            'success': True,
            'action': action,
            'likes': actual_likes_count
        })
            
    except Announcement.DoesNotExist:
        return Response(
            {'error': 'Announcement not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def announcement_stats(request):
    total_announcements = Announcement.objects.filter(is_published=True).count()
    total_comments = Comment.objects.count()
    total_likes = AnnouncementLike.objects.count()
    total_categories = Category.objects.filter(is_active=True).count()
    total_hashtags = Hashtag.objects.count()
    
    # Category statistics
    categories = Category.objects.filter(is_active=True)
    category_stats = []
    for category in categories:
        category_stats.append({
            'id': category.id,
            'name': category.name,
            'slug': category.slug,
            'color': category.color,
            'count': category.announcements.filter(is_published=True).count()
        })
    
    # Popular hashtags
    popular_hashtags = Hashtag.objects.filter(usage_count__gt=0).order_by('-usage_count')[:10]
    hashtag_stats = [
        {
            'id': tag.id,
            'name': tag.name,
            'usage_count': tag.usage_count
        }
        for tag in popular_hashtags
    ]
    
    return Response({
        'total_announcements': total_announcements,
        'total_comments': total_comments,
        'total_likes': total_likes,
        'total_categories': total_categories,
        'total_hashtags': total_hashtags,
        'category_stats': category_stats,
        'popular_hashtags': hashtag_stats
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_pin(request, announcement_id):
    # Only admins can pin/unpin announcements
    if request.user.role != 'admin':
        return Response(
            {'error': 'Only administrators can pin announcements'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        announcement = Announcement.objects.get(id=announcement_id)
        announcement.is_pinned = not announcement.is_pinned
        announcement.save()
        
        action = 'pinned' if announcement.is_pinned else 'unpinned'
        return Response({
            'success': True,
            'action': action,
            'is_pinned': announcement.is_pinned
        })
        
    except Announcement.DoesNotExist:
        return Response(
            {'error': 'Announcement not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
