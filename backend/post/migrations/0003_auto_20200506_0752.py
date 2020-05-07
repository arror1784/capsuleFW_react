# Generated by Django 3.0.5 on 2020-05-06 07:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0002_uploadfilemodel'),
    ]

    operations = [
        migrations.CreateModel(
            name='FilePrinting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(null=True, upload_to='')),
                ('create_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('M_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('curing_time', models.IntegerField()),
                ('bed_curing_layer', models.IntegerField()),
                ('bed_curing_time', models.IntegerField()),
                ('layer_delay', models.IntegerField()),
                ('layer_height', models.IntegerField()),
                ('z_hop_height', models.IntegerField()),
            ],
        ),
        migrations.DeleteModel(
            name='UploadFileModel',
        ),
    ]
