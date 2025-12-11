from django.db import models
from django.utils import timezone
from colleges.models import College


class Leader(models.Model):
    CABINET_POSITIONS = [
        ('President', 'President'),
        ('Vice President', 'Vice President'),
        ('Secretary General', 'Secretary General'),
        ('Deputy Secretary General', 'Deputy Secretary General'),
        ('Treasurer', 'Treasurer'),
        ('Minister', 'Minister'),
        ('Deputy Minister', 'Deputy Minister'),
        ('Director', 'Director'),
        ('Other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255, choices=CABINET_POSITIONS)
    department = models.CharField(max_length=255)
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='leaders')
    description = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    join_date = models.DateField(default=timezone.now)
    team_size = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='leaders/', blank=True, null=True)
    is_cabinet = models.BooleanField(default=True, help_text="Check if this leader is part of the main cabinet")
    
    def __str__(self):
        return f"{self.name} - {self.position}"


class LeaderAchievement(models.Model):
    leader = models.ForeignKey(Leader, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.leader.name} - {self.achievement[:50]}..."
