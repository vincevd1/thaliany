# Generated by Django 5.0.4 on 2024-05-08 14:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_rename_anytimer_id_anytimerproof_anytimer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='anytimerproof',
            name='anytimer',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.anytimer'),
        ),
    ]
