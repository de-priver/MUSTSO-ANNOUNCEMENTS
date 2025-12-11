from django.db import models


class College(models.Model):
    name = models.CharField(max_length=255)
    leader_name = models.CharField(max_length=255)
    leader_image = models.ImageField(upload_to='college_leaders/', blank=True, null=True)
    
    def __str__(self):
        return self.name


class Department(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    leader_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.name} - {self.college.name}"
