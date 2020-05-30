from django.shortcuts import render, get_object_or_404

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.conf import settings

from .models import Post,Material,PrintingState, FilePrinting

from post.forms import FilePrintingForm

from channels.layers import get_channel_layer
from .webSocketServer import PrintSettingConsumer

from asgiref.sync import async_to_sync

import os,shutil,json,time,zipfile
from pathlib import Path

def file(request):
	if request.method == 'POST':
		form = FilePrintingForm(request.POST,request.FILES)
		if form.is_valid():
		
			if not request.FILES['file'].name.endswith(".zip"):
				return HttpResponse(status=400)

			form.save()
			
			FP = FilePrinting.objects.order_by('create_at').last()

			

			state, is_follow = PrintingState.objects.get_or_create(id=1)
			state.printing_name = os.path.splitext(request.FILES['file'].name)[0]
			state.printing_file_name = os.path.splitext(FP.file.name)[0]
			state.save()
			
			filePath = settings.MEDIA_ROOT + '/' + FP.file.name
			folderPath = settings.MEDIA_ROOT + '/' + os.path.splitext(FP.file.name)[0] + '_dir'

			os.mkdir(folderPath)
					
			imagezip=zipfile.ZipFile(filePath)
			imagezip.extractall(folderPath)
			
			try:
				with open(folderPath + '/info.json') as json_file:
					json_data = json.load(json_file)

					if 'layer_height' not in json_data:
						return HttpResponse(status=400)
					if 'total_layer' not in json_data:
						return HttpResponse(status=400)

			except (json.JSONDecodeError, KeyError) as e:
				return HttpResponse(status=400)

			mt,is_created = Material.objects.get_or_create(M_id="custom_resin")
			if Path(folderPath + '/custom_resin.json').exists():
				try:
					with open(folderPath + '/custom_resin.json') as json_file:
						json_data = json.load(json_file)

						mt.curing_time=json_data["curing_time"]
						mt.bed_curing_layer=json_data["bed_curing_layer"]
						mt.bed_curing_time=json_data["bed_curing_time"]
						mt.layer_delay=json_data["layer_delay"]
						mt.layer_height=json_data["layer_height"]
						mt.z_hop_height=json_data["z_hop_height"]

						mt.z_hop_height=json_data["max_speed"]
						mt.z_hop_height=json_data["init_speed"]
						mt.z_hop_height=json_data["up_accel_speed"]
						mt.z_hop_height=json_data["up_decel_speed"]
						mt.z_hop_height=json_data["down_accel_speed"]
						mt.z_hop_height=json_data["down_decel_speed"]

						mt.save()

						state.material = mt
						state.save()

				except (json.JSONDecodeError, KeyError) as e:
					return HttpResponse(status=400)
			else:
				mt.delete()
		else:
			return HttpResponse(status=400)
		
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(PrintSettingConsumer.GROUP_NAME,{'type': 'updateTimeout'})

		return HttpResponse(status=200)
	else:
		return HttpResponse(status=404)

