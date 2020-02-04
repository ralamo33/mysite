from django.db import models
import django.utils


# Create your models here.
class Project(models.Model):
    project_title = models.CharField(max_length=200)
    project_published = models.DateTimeField("date published", default=django.utils.timezone.now)
    project_description = models.CharField(max_length=5000)
    project_link = models.URLField(default="")
    project_image = models.ImageField(default="")
    project_github = models.URLField(default="")

    def __str__(self):
        return self.project_title