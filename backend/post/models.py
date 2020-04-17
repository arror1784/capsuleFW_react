from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title

class UploadFileModel(models.Model):
	file = models.FileField(null=True)

# Create your models here.
