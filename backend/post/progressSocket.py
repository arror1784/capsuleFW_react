from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

import json,time

class ProgressConsumer(WebsocketConsumer):

	def connect(self):
		async_to_sync(self.channel_layer.group_add)(
			"chat_progress",
			self.channel_name)
    
		self.accept()   

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			"chat_progress",
			self.channel_name)

	def updateProgress(self,event):
		print("fqwsdfwfesfd")
		self.send(json.dumps(event['message']))
