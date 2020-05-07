from django.shortcuts import render, get_object_or_404
from rest_framework import generics

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.safestring import mark_safe
from django.core import serializers
from django.forms.models import model_to_dict

from .models import Post,Material
from .serializers import PostSerializer

from post.forms import FilePrintingForm

import json,time

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
		form = FilePrintingForm(request.POST,request.FILES)
		print(request.FILES['file'].name)
		if form.is_valid():
			form.save()
			if(request.FILES['file'].name == 'error_test'):
				return HttpResponse(status=400)
			return HttpResponse(status=201)
	return HttpResponse(status=404)

def printerState(request):
	dic = {}

	dic["state"] = "ready"
	return JsonResponse(dic)	

def materialList(requet):
	materials = Material.objects.values("M_id")
	return JsonResponse(list(materials),safe=False)

def material(request,materialName):
	material = get_object_or_404(Material,pk=materialName)
	
	material_dic = model_to_dict(material)

	return JsonResponse(material_dic)


