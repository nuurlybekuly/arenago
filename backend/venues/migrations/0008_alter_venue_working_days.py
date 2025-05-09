# Generated by Django 5.2 on 2025-04-26 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0007_venue_end_venue_start_venue_working_days'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venue',
            name='working_days',
            field=models.CharField(default='1:2:3:4:5:6:7', help_text="Store working days as colon-separated numbers, e.g., '1:2:5'", max_length=20),
        ),
    ]
