# Generated by Django 3.0.5 on 2020-05-11 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0007_auto_20200508_1447'),
    ]

    operations = [
        migrations.AlterField(
            model_name='material',
            name='bed_curing_layer',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='material',
            name='bed_curing_time',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='material',
            name='curing_time',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='material',
            name='layer_delay',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='material',
            name='layer_height',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='material',
            name='z_hop_height',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
