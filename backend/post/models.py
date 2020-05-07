from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title

class PrintingState(models.Model):

	READY = 'ready'
	PRINT = 'print'
	PAUSE = 'pause'

	STATE_LIST = [
		(READY, 'ready'),
		(PRINT, 'print'),
		(PAUSE, 'pause'),
	]

	state = models.CharField(
		choices=STATE_LIST,
		max_length=6,
		default=READY
	)

	total_layer = models.IntegerField(default=0)
	current_layer = models.IntegerField(default=0)
	material = models.ForeignKey('Material',on_delete=models.PROTECT,null=True)

class PrinterSetting(models.Model):
	height_offset = models.IntegerField()
	led_offset = models.FloatField()

class FilePrinting(models.Model):
	file = models.FileField(null=True)
	create_at = models.DateTimeField(auto_now_add=True)

class Material(models.Model):
	M_id = models.CharField(max_length=50,primary_key=True)
	curing_time = models.IntegerField()
	bed_curing_layer = models.IntegerField()
	bed_curing_time = models.IntegerField()
	layer_delay = models.IntegerField()
	layer_height = models.IntegerField()
	z_hop_height = models.IntegerField()

