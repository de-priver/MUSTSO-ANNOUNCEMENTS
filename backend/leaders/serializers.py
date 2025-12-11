from rest_framework import serializers
from .models import Leader, LeaderAchievement
from colleges.serializers import CollegeSerializer


class LeaderAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderAchievement
        fields = ['id', 'achievement', 'order']


class LeaderSerializer(serializers.ModelSerializer):
    achievements = LeaderAchievementSerializer(many=True, read_only=True)
    college = CollegeSerializer(read_only=True)
    
    class Meta:
        model = Leader
        fields = [
            'id', 'name', 'position', 'department', 'description', 
            'email', 'phone', 'location', 'join_date', 'team_size', 
            'image', 'is_cabinet', 'college', 'achievements'
        ]


class LeaderCreateUpdateSerializer(serializers.ModelSerializer):
    achievements = serializers.ListField(
        child=serializers.CharField(max_length=500),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Leader
        fields = [
            'name', 'position', 'department', 'description', 
            'email', 'phone', 'location', 'join_date', 'team_size', 
            'image', 'is_cabinet', 'college', 'achievements'
        ]
    
    def create(self, validated_data):
        achievements_data = validated_data.pop('achievements', [])
        leader = Leader.objects.create(**validated_data)
        
        for i, achievement in enumerate(achievements_data):
            LeaderAchievement.objects.create(
                leader=leader,
                achievement=achievement,
                order=i
            )
        
        return leader
    
    def update(self, instance, validated_data):
        achievements_data = validated_data.pop('achievements', [])
        
        # Update leader fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update achievements
        if achievements_data:
            instance.achievements.all().delete()
            for i, achievement in enumerate(achievements_data):
                LeaderAchievement.objects.create(
                    leader=instance,
                    achievement=achievement,
                    order=i
                )
        
        return instance
