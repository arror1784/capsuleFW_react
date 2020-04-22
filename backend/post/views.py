from django.shortcuts import render
from rest_framework import generics

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.safestring import mark_safe

from .models import Post
from .serializers import PostSerializer

from post.forms import UploadFileForm

import json,time

from .printerControl import PrinterControl
from .calc_file_hash import calc_file_hash

pc = PrinterControl('/home/pi/PIPE/SV_PIPE','/home/pi/PIPE/PR_PIPE')
pc.threadStart()

class ListPost(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class DetailPost(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

def test(request):
	print(request.body)
	return JsonResponse(json.loads('{"hello" : "hello"}')) 


def upload_file(request):
	if request.method == 'POST':
		form = UploadFileForm(request.POST,request.FILES)
		print(request.FILES['file'].name)
		if form.is_valid():
			form.save()
			if(request.FILES['file'].name == 'error_test'):
				return HttpResponse(status=400)
			return HttpResponse(status=201)
	return HttpResponse(status=404)

def progress(request):
	dic = {}

	dic["time"] =  time.strftime('%H-%M-%S', time.localtime(time.time()))
	dic["progress"] = round(time.time() % 100)
	return JsonResponse(dic)

def printerState(request):
	dic = {}

	dic["state"] = "ready"
	return JsonResponse(dic)	

def changeState(request,slug):
	
	if(request.method != 'POST'):
		return HttpResponse(status=400)
	if(slug == 'print'):
		pc.start()	
		pass
	elif(slug == 'pause'):
		pass
	elif(slug == 'finish'):
		pass
	else:
		return HttpResponse(status=400)
	return HttpResponse(status=200)

def materialList(request):
	
	materialList = ["temp","final"]
	dic = {}
	dic["materialList"] = materialList
	return JsonResponse(dic)

def chat(request):
	return render(request, 'post/chat.html',{})

def room(request,room_name):
	return render(request, 'post/room.html',{
		'room_name_json':mark_safe(json.dumps(room_name))
		})
