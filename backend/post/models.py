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
	PAUSE_START = 'pause_start'
	SETTING = 'setting'

	STATE_LIST = [
		(READY, 'ready'),
		(PRINT, 'print'),
		(PAUSE, 'pause'),
		(PAUSE_START, 'pause_start'),
		(SETTING, 'setting'),
	]

	state = models.CharField(
		choices=STATE_LIST,
		max_length=11,
		default=READY
	)
	print_setting_name = models.CharField(max_length=30,null=True,blank=True)
	total_layer = models.IntegerField(default=0)
	current_layer = models.IntegerField(default=0)
	# material = models.ForeignKey('Material',models.SET_NULL,null=True,blank=True)
	material = models.CharField(max_length=50,null=True,blank=True)
	printing_name = models.CharField(max_length=50,null=True,blank=True)
	printing_file_name = models.CharField(max_length=50,null=True,blank=True)

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
	z_hop_height = models.IntegerField(blank=True,default=0)


	max_speed = models.IntegerField(blank=True,default=0)
	init_speed = models.IntegerField(blank=True,default=0)
	up_accel_speed = models.IntegerField(blank=True,default=0)
	up_decel_speed = models.IntegerField(blank=True,default=0)
	down_accel_speed = models.IntegerField(blank=True,default=0)
	down_decel_speed = models.IntegerField(blank=True,default=0)

