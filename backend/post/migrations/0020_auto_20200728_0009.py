# Generated by Django 3.0.5 on 2020-07-28 00:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0019_auto_20200727_2328'),
    ]

    operations = [
        migrations.AlterField(
            model_name='printingstate',
            name='state',
            field=models.CharField(choices=[('ready', 'ready'), ('print', 'print'), ('pause', 'pause'), ('setting', 'setting')], default='ready', max_length=7),
        ),
    ]
