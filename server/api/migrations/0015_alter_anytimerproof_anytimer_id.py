# Generated by Django 5.0.4 on 2024-05-08 13:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_anytimerproof_file_url_anytimerproof_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='anytimerproof',
            name='anytimer_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.anytimer'),
        ),
    ]
