# Generated by Django 3.0.2 on 2020-02-03 23:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20200203_2041'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='project_image',
            field=models.ImageField(default='', upload_to='images'),
        ),
    ]
