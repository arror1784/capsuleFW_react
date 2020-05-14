from django.shortcuts import render, get_object_or_404

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.conf import settings

from .models import Post,Material,PrintingState

from post.forms import FilePrintingForm

import os,shutil,json,time,zipfile
from pathlib import Path

def file(request):
	if request.method == 'POST':
		form = FilePrintingForm(request.POST,request.FILES)
		if form.is_valid():
		
			if not request.FILES['file'].name.endswith(".zip"):
				return HttpResponse(status=400)

			form.save()

			state, is_follow = PrintingState.objects.get_or_create(id=1)
			state.printing_name = request.FILES['file'].name.split('.')[0]
			state.save()

			dirpath = Path('/home/pi/printFilePath')
			if dirpath.exists():
				shutil.rmtree('/home/pi/printFilePath')
			os.mkdir('/home/pi/printFilePath')

			imagezip=zipfile.ZipFile(settings.MEDIA_ROOT+'/'+request.FILES['file'].name)
			imagezip.extractall('/home/pi/printFilePath')

			mt,is_created = Material.objects.get_or_create(M_id="custom_resin")
			if Path('/home/pi/printFilePath/custom_resin.json').exists():
				try:
					with open('/home/pi/printFilePath/custom_resin.json') as json_file:
						json_data = json.load(json_file)

						mt.curing_time=json_data["curing_time"]
						mt.bed_curing_layer=json_data["bed_curing_time"]
						mt.bed_curing_time=json_data["bed_curing_time"]
						mt.layer_delay=json_data["layer_delay"]
						mt.layer_height=json_data["layer_height"]
						mt.z_hop_height=json_data["z_hop_height"]

						mt.save()

						state.material = mt
						state.save()

				except json.JSONDecodeError:
					return HttpsResponse(status=400)
			else:
				mt.delete()
		else:
			return HttpResponse(status=400)
		return HttpResponse(status=200)
	else:
		return HttpResponse(status=404)

