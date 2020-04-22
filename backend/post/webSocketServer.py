from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from apscheduler.schedulers.background import BackgroundScheduler

import json,time

class PrinterConsumer(WebsocketConsumer):
 
	def connect(self):
		self.accept()
	
		self.scheduler = BackgroundScheduler()

		self.scheduler.add_job(self.sendHello, 'interval', seconds=5, id="test")
		self.scheduler.start()

	def disconnect(self, close_code):
		self.scheduler.shutdown(wait=False)

	def receive(self, text_data):
		print("received : " + text_data)

	def chat_message(self, event):
		message = event['message']

		self.send("hello world")

	def sendHello(self):
		dic = {}
		dic["message"] = "hello world message";

		self.send(json.dumps(dic))

class ProgressConsumer(WebsocketConsumer):
	
	def connect(self):
		self.accept()	
		
		self.scheduler = BackgroundScheduler()
		self.scheduler.add_job(self.sendProgress,'interval', seconds=1)
		self.scheduler.start()
	
	def disconnect(self, close_code):
		self.scheduler.shutdown(wait=False)

	def sendProgress(self):
		dic = {}
		dic["time"] = time.strftime('%H-%M-%S', time.localtime(time.time()))
		dic["progress"] = round(time.time() % 100)

		self.send(json.dumps(dic))
