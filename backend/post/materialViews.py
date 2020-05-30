from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse

from django.forms.models import model_to_dict

from channels.layers import get_channel_layer
from .webSocketServer import PrintSettingConsumer

from asgiref.sync import async_to_sync

from .models import Post,Material,PrintingState

import os,shutil,json,time,zipfile
from pathlib import Path


def materialList(requet):
	materials = Material.objects.values("M_id")
	return JsonResponse(list(materials),safe=False)

def materialInfo(request,materialName):
	material = get_object_or_404(Material,pk=materialName)
    
	material_dic = model_to_dict(material)

	return JsonResponse(material_dic)

def materialSelect(request,materialName):
    
	selectedMaterial = get_object_or_404(Material,M_id=materialName)
	state, is_follow = PrintingState.objects.get_or_create(id=1)
    
	state.material = selectedMaterial
    
	state.save()

	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(PrintSettingConsumer.GROUP_NAME,{'type':'updateTimeout'})
	
	return HttpResponse(status=200)
