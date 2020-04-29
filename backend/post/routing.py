from django.conf.urls import url
from django.urls import path
from . import consumers, webSocketServer

websocket_urlpatterns = [
    url(r'^ws/room/(?P<room_name>[^/]+)/$', consumers.ChatConsumer),
	path('ws/room/<slug:room_name>/',consumers.ChatConsumer),
	path('ws/printer',webSocketServer.PrinterConsumer),
	path('ws/progress',webSocketServer.ProgressConsumer),
]