from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async

import json,time

class PrinterConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):

        # TODO: unique printer ID for group name
        self.printer_group_name = "UNIQUE_PRINTER_NAME"
        self.front_group_name = self.printer_group_name + "_front"
        
        await self.channel_layer.group_add(
            self.printer_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.printer_group_name,
            self.channel_name
        )
        await self.close()
    # Receive message from room group
    async def front_to_back(self, event):
        json = event['json']
        # Send message to WebSocket
        await self.send_json(content=json)
    # From Websocket
    async def receive_json(self, content):
        await self.channel_layer.group_send(
            self.front_group_name,
            {
                'type': 'back_to_front',
                'json': content
            }
        )
        
    
