from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse

from django.forms.models import model_to_dict

from channels.layers import get_channel_layer
from .webSocketServer import PrintSettingConsumer

from asgiref.sync import async_to_sync

from .models import Post,Material,PrintingState

import os,shutil,json,time,zipfile
from pathlib import Path

from django.conf import settings

def materialList(request):

	Ldata = []
	try:
		with open(settings.PRINTER_SETTING_PATH,'r') as json_file:
			json_data = json.load(json_file)
			Ldata = json_data["material_list"]
	except IOError as e:
		print("I/O error",e)
		return HttpResponse(status=404)
		
	return JsonResponse(Ldata,safe=False)

def materialInfo(request,materialName):
    
	try:
		with open(settings.RESIN_PATH + "/" + materialName + ".json") as json_file:
			json_data = json.load(json_file)
	except IOError as e:
		print("I/O error",e)
		return HttpResponse(status=404)

	# material = get_object_or_404(Material,pk=materialName)
	# material_dic = model_to_dict(material)

	return JsonResponse(json_data)

def materialSelect(request,materialName):
    
	# selectedMaterial = get_object_or_404(Material,M_id=materialName)
	Ldata = []
	
	try:
		with open(settings.PRINTER_SETTING_PATH,'r') as json_file:
			json_data = json.load(json_file)
			Ldata = json_data["material_list"]
			if materialName in Ldata:
				print("there is material",materialName)
			else:
				print("there is no material",materialName)
				return HttpResponse(status=404)
	except IOError as e:
		print("I/O error",e)
		return HttpResponse(status=404)
	
	state, is_follow = PrintingState.objects.get_or_create(id=1)

	state.material = materialName
	
	state.save()

	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(PrintSettingConsumer.GROUP_NAME,{'type':'updateTimeout'})
	
	return HttpResponse(status=200)
