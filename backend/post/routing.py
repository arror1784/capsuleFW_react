from django.conf.urls import url
from django.urls import path
from post.frontendSocket import FrontendConsumer
from post.printerSocket import PrinterConsumer


websocket_urlpatterns = [
    path('ws/front',FrontendConsumer),
    path('ws/printer',PrinterConsumer),

]
