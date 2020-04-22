from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title

class UploadFileModel(models.Model):
	#create_at = models.DateTimeField()
	create_at = models.DateTimeField(auto_now_add=True)
	file = models.FileField(null=True)

class PrinterState(models.Model):
	READY = 'ready'
	PRINT = 'print'
	PAUSE = 'pause'
	FINISH = 'finish'

	STATE_LIST = [
		(READY, 'ready'),
		(PRINT, 'print'),
		(PAUSE, 'pause'),
		(FINISH, 'finish'),
	]

	state = models.CharField(
		choices=STATE_LIST,
		max_length=6,
		default=FINISH
	)

# Create your models here.
