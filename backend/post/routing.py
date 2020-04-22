from django.conf.urls import url
from django.urls import path
from . import consumers, webSocketServer

websocket_urlpatterns = [
    #url(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer),
	path('ws/room/<slug:room_name>/',consumers.ChatConsumer),
	path('ws/ws',webSocketServer.PrinterConsumer),
	path('ws/progress',webSocketServer.ProgressConsumer),
]
