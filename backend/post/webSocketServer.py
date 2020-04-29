from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from apscheduler.schedulers.background import BackgroundScheduler

import json,time

class PrinterConsumer(WebsocketConsumer):

	def connect(self):

		async_to_sync(self.channel_layer.group_add)(
			"chat_printer",
			self.channel_name
		)

		self.accept()

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			"chat_printer",
			self.channel_name
		)

	def receive(self, text_data):
		message = json.loads(text_data)

		if message['type'] == 'progress':
			async_to_sync(self.channel_layer.group_send)(
				"chat_progress",
				{
					'type': 'updateProgress',
					'message': message
				}
			)

class ProgressConsumer(WebsocketConsumer):

	def connect(self):
		async_to_sync(self.channel_layer.group_add)(
			"chat_progress",
            self.channel_name
        )

		self.accept()	

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			"chat_progress",
			self.channel_name
		)

	def updateProgress(self,event):
		
		message = event['message']
		dic = {}
		dic["time"] = message['time']
		dic["progress"] = message['progress']
	
		self.send(json.dumps(dic))
