from django.shortcuts import render, get_object_or_404
from rest_framework import generics

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.safestring import mark_safe
from django.core import serializers
from django.forms.models import model_to_dict
from django.conf import settings

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Post,Material,PrintingState
from .serializers import PostSerializer

from post.forms import FilePrintingForm

import os,shutil,json,time,zipfile
from pathlib import Path

def test(request):
	print(request.body)
	return HttpResponse(status=200)

def get_csrf(request):
	return render(request,'post/csrf.html',{})

def printerState(request):
	dic = {}

	state,is_follow = PrintingState.objects.get_or_create(id=1)

	dic["state"] = state.state

	return JsonResponse(dic)

def startPrint(request):
	if request.method != 'POST':
		return HttpResponse(status=404)
	#check printer state
	state,is_follow = PrintingState.objects.get_or_create(id=1)
	if state.state != PrintingState.READY:
		return HttpResponse(status=400)
	#check material available
	if state.material is None:
		return HttpResponse(status=400)
	#check file
	if state.printing_name is None:
		return HttpResponse(status=400)
	#send start to qt
	message = {}
	message["type"] = "printCommand"
	message["command"] = "start"
	message["printing_name"] = state.printing_name
	message["folder_path"] = settings.MEDIA_ROOT + '/' + state.printing_file_name
	message["material"] = state.material

	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
			"chat_printer" 
			,{"type": "sendToPrinter","message": message})
	
	#4. response 404 or 200
	return HttpResponse(status=200)

