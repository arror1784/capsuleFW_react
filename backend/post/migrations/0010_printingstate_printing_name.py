# Generated by Django 3.0.5 on 2020-05-11 05:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0009_auto_20200511_1409'),
    ]

    operations = [
        migrations.AddField(
            model_name='printingstate',
            name='printing_name',
            field=models.CharField(default='-', max_length=50),
        ),
    ]
