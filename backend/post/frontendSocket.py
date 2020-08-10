from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer

import json,time



class FrontendConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):

        # TODO: unique front ID for group name
        self.printer_group_name = "UNIQUE_PRINTER_NAME"
        self.front_group_name = self.printer_group_name + "_front"
        await self.channel_layer.group_add(
            self.front_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.front_group_name,
            self.channel_name
        )
        await self.close()

    # Receive message from room group
    async def back_to_front(self, event):
        json = event['json']
        # Send message to WebSocket
        await self.send_json(content=json)
            
    # From Websocket
    async def receive_json(self, content):
        await self.channel_layer.group_send(
            self.printer_group_name,
            {
                'type': 'front_to_back',
                'json': content
            }
        )
        
    
