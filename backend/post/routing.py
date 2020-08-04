from django.conf.urls import url
from django.urls import path
from frontendSocket import FrontendConsumer
from printerSocket import PrinterConsumer


websocket_urlpatterns = [
    path('ws/front',FrontendConsumer),
    path('ws/printer',PrinterConsumer),

]
