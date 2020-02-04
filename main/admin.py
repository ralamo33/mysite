from django.contrib import admin
from .models import Project
from django.db import models
from tinymce.widgets import TinyMCE

# Register your models here.

class ProjectAdmin(admin.ModelAdmin):
    fieldsets = [("title/date", {"fields": ["project_title", "project_published"]}),
                 ("content", {"fields": ["project_description", "project_link"]}),
                 ("image", {"fields": ["project_image"]}),
                 ("github", {"fields": ["project_github"]})]

admin.site.register(Project, ProjectAdmin)