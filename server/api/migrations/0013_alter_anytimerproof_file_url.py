# Generated by Django 5.0.4 on 2024-05-03 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_remove_anytimerproof_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='anytimerproof',
            name='file_url',
            field=models.CharField(max_length=500, null=True),
        ),
    ]