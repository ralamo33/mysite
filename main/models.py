from django.db import models
import django.utils


# Create your models here.
class Project(models.Model):
    project_title = models.CharField(max_length=200)
    project_description = models.CharField(max_length=5000)
    project_code = models.TextField()
    project_published = models.DateTimeField("date published", default=django.utils.timezone.now)
    
    def __str__(self):
        return self.project_title