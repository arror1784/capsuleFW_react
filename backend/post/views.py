from django.shortcuts import render, get_object_or_404
from rest_framework import generics

from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.utils.safestring import mark_safe
from django.core import serializers
from django.forms.models import model_to_dict
from django.conf import settings

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



import os,shutil,json,time,zipfile
from pathlib import Path
from django.views.decorators.http import require_GET, require_POST

def test(request):
    print(request.body)
    return HttpResponse(status=200)

def get_csrf(request):
    return render(request,'post/csrf.html',{})
