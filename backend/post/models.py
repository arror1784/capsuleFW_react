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
	material = models.ForeignKey('Material',models.SET_NULL,null=True,blank=True)
	printing_name = models.CharField(max_length=50,default="-",null=True,blank=True)

class PrinterSetting(models.Model):
	height_offset = models.IntegerField()
	led_offset = models.FloatField()

class FilePrinting(models.Model):
	file = models.FileField(null=True)
	create_at = models.DateTimeField(auto_now_add=True)

class Material(models.Model):
	M_id = models.CharField(max_length=50,primary_key=True)
	curing_time = models.IntegerField(blank=True,default=0)
	bed_curing_layer = models.IntegerField(blank=True,default=0)
	bed_curing_time = models.IntegerField(blank=True,default=0)
	layer_delay = models.IntegerField(blank=True,default=0)
	layer_height = models.FloatField(blank=True,default=0.0)
	z_hop_height = models.IntegerField(blank=True,default=0)

