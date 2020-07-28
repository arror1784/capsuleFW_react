from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

import json,time

class ProgressConsumer(WebsocketConsumer):

	GROUP_NAME = "chat_progress"

	def connect(self):
		async_to_sync(self.channel_layer.group_add)(
			self.GROUP_NAME,
			self.channel_name)
    
		self.accept()   

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.GROUP_NAME,
			self.channel_name)

	def updateProgress(self,event):
		print("updateProgress")
		self.send(json.dumps(event['message']))

	def changeState(self,event):
		print("changeState")
		self.send(json.dumps(event['message']))
		
	def receive(self, text_data):
		ms = json.loads(text_data)
		if ms['type'] == 'stateChangeCommand':
			async_to_sync(self.channel_layer.group_send)(
				self.GROUP_NAME,
				{
					'type': 'changeState',
					'message': ms
				})
			async_to_sync(self.channel_layer.group_send)(
				"chat_printer",
				{
					'type': 'changeState',
					'message': ms
				})
    
