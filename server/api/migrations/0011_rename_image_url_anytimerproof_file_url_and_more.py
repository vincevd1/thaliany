# Generated by Django 5.0.4 on 2024-04-30 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_anytimerproof_image_anytimerproof_image_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='anytimerproof',
            old_name='image_url',
            new_name='file_url',
        ),
        migrations.AddField(
            model_name='anytimerproof',
            name='file',
            field=models.FileField(default='old', upload_to='../static/proofs'),
            preserve_default=False,
        ),
    ]
