from django.shortcuts import render
from rest_framework import generics

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse

from .models import Post
from .serializers import PostSerializer

import json

class ListPost(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class DetailPost(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

def test(request):
	print(request.body)
	return JsonResponse(json.loads('{"hello" : "hello"}')) 

# Create your views here.
