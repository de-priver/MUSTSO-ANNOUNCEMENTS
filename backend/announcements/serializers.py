from rest_framework import serializers
from django.utils.text import slugify
from .models import Announcement, Comment, AnnouncementLike, Category, Hashtag
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'color', 'is_active']
        read_only_fields = ['slug']
    
    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'name', 'slug', 'usage_count']
        read_only_fields = ['slug', 'usage_count']


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'timestamp', 'updated_at']
        read_only_fields = ['id', 'timestamp', 'updated_at']


class AnnouncementSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    hashtags = HashtagSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.ReadOnlyField()
    hashtag_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'description', 'category', 'author', 
            'timestamp', 'updated_at', 'likes', 'media', 'hashtags', 
            'hashtag_list', 'comments', 'comments_count', 'is_pinned', 'is_published'
        ]
        read_only_fields = ['id', 'timestamp', 'updated_at', 'likes', 'author']


class AnnouncementListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    hashtags = HashtagSerializer(many=True, read_only=True)
    comments_count = serializers.ReadOnlyField()
    hashtag_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'description', 'category', 'author', 
            'timestamp', 'updated_at', 'likes', 'media', 'hashtags',
            'hashtag_list', 'comments_count', 'is_pinned', 'is_published'
        ]
        read_only_fields = ['id', 'timestamp', 'updated_at', 'likes', 'author']


class AnnouncementCreateUpdateSerializer(serializers.ModelSerializer):
    hashtag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
        help_text="List of hashtag names (without # symbol)"
    )
    category_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Announcement
        fields = [
            'title', 'description', 'category_id', 'media', 
            'hashtag_names', 'is_pinned', 'is_published'
        ]
    
    def create(self, validated_data):
        hashtag_names = validated_data.pop('hashtag_names', [])
        category_id = validated_data.pop('category_id', None)
        
        # Set category if provided
        if category_id:
            try:
                category = Category.objects.get(id=category_id, is_active=True)
                validated_data['category'] = category
            except Category.DoesNotExist:
                pass
        
        announcement = Announcement.objects.create(**validated_data)
        
        # Handle hashtags
        if hashtag_names:
            hashtags = []
            for name in hashtag_names:
                name = name.strip().lower().replace('#', '')
                if name:
                    hashtag, created = Hashtag.objects.get_or_create(
                        name=name,
                        defaults={'slug': slugify(name)}
                    )
                    hashtags.append(hashtag)
            
            announcement.hashtags.set(hashtags)
            
            # Update usage counts
            for hashtag in hashtags:
                hashtag.usage_count = hashtag.announcements.count()
                hashtag.save()
        
        return announcement
    
    def update(self, instance, validated_data):
        hashtag_names = validated_data.pop('hashtag_names', None)
        category_id = validated_data.pop('category_id', None)
        
        # Update category if provided
        if category_id is not None:
            try:
                category = Category.objects.get(id=category_id, is_active=True)
                validated_data['category'] = category
            except Category.DoesNotExist:
                validated_data['category'] = None
        
        # Update announcement fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle hashtags if provided
        if hashtag_names is not None:
            # Remove old hashtags and update their counts
            old_hashtags = list(instance.hashtags.all())
            instance.hashtags.clear()
            
            # Add new hashtags
            hashtags = []
            for name in hashtag_names:
                name = name.strip().lower().replace('#', '')
                if name:
                    hashtag, created = Hashtag.objects.get_or_create(
                        name=name,
                        defaults={'slug': slugify(name)}
                    )
                    hashtags.append(hashtag)
            
            instance.hashtags.set(hashtags)
            
            # Update usage counts for all affected hashtags
            all_hashtags = set(old_hashtags + hashtags)
            for hashtag in all_hashtags:
                hashtag.usage_count = hashtag.announcements.count()
                hashtag.save()
        
        return instance


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']


class AnnouncementLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementLike
        fields = ['id', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'description', 'color', 'is_active']
    
    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if 'name' in validated_data:
            validated_data['slug'] = slugify(validated_data['name'])
        return super().update(instance, validated_data)
