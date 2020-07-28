from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from apscheduler.schedulers.background import BackgroundScheduler

from .models import PrintingState

import json,time

class PrinterConsumer(WebsocketConsumer):

	GROUP_NAME = "chat_printer"

	def connect(self):
		async_to_sync(self.channel_layer.group_add)(
			self.GROUP_NAME,
			self.channel_name
		)
		self.accept()

		dic = {}
		dic["type"] = "websocket_name"
		dic["name"] = self.channel_name

		self.send(json.dumps(dic))

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.GROUP_NAME,
			self.channel_name)

	def receive(self, text_data):
		ms = json.loads(text_data)
		state, is_follow = PrintingState.objects.get_or_create(id=1)

		print(ms)
		if ms['type'] == 'progressUpdate':
			async_to_sync(self.channel_layer.group_send)(
				"chat_progress",
				{
					'type': 'updateProgress',
					'message': ms
				})
		# else:
		elif ms['type'] == 'stateChangeCommand':
			if ms['type'] == 'start':
				state.state = PrintingState.PRINT
			elif ms['type'] == 'pauseStart':
				state.state = PrintingState.PAUSE_START
			elif ms['type'] == 'pauseFinish':
				state.state = PrintingState.PAUSE
			elif ms['type'] == 'finish':
				state.state = PrintingState.READY
			async_to_sync(self.channel_layer.group_send)(
				"chat_progress",
				{
					'type': 'changeState',
					'message': ms
				})
		
		state.save()

	def sendToPrinter(self,event):
		self.send(json.dumps(event['message']))

	def changeState(self,event):
		self.send(json.dumps(event['message']))
	
class PrintSettingConsumer(WebsocketConsumer): #check for setting

	GROUP_NAME = "print_setting"
	TIME_OUT_MIN = 1

	def connect(self):
		
		state, is_follow = PrintingState.objects.get_or_create(id=1)		
		if state.print_setting_name != None:
			self.close()
		elif state.state != PrintingState.READY:
			self.close()
		else:
			state.print_setting_name = self.channel_name
			state.save()

		self.sched = BackgroundScheduler()
		self.sched.start()

		self.sched.add_job(self.timeout, 'interval', minutes=self.TIME_OUT_MIN,id="timeout")

		async_to_sync(self.channel_layer.group_add)(
			self.GROUP_NAME,
			self.channel_name)
		self.accept()

		dic = {}
		dic["type"] = "websocket_name"
		dic["name"] = self.channel_name
	
		self.send(json.dumps(dic))
		
	def disconnect(self, close_code):
		
		state, is_follow = PrintingState.objects.get_or_create(id=1)
		print("disconect")
		print("print_setting_name",state.print_setting_name)
		print("channel_name      ",self.channel_name)
		if state.print_setting_name == self.channel_name:
			print("compare true print_setting_name and channel_name")
			state.print_setting_name = None
		state.save()

	def updateTimeout(self,event):
		self.sched.remove_job("timeout")
		self.sched.add_job(self.timeout, 'interval', minutes=self.TIME_OUT_MIN,id="timeout")

	def timeout(self):
		self.sched.remove_job("timeout")
		self.sched.shutdown(wait=False)
		self.close(code=4100)
