import os
import threading
import select
import time
from .message import decode_msg_size, create_msg, strToBstr

class PrinterControl:

	def __init__(self,FIFO_in_path,FIFO_out_path):
		
		self.waitForResponse = True
		self.response = ""
		self.FIFO_IN_PATH = FIFO_in_path
		self.FIFO_OUT_PATH = FIFO_out_path

		self.openFIFO_in()
		self.openFIFO_out()

	def openFIFO_in(self):
		if not os.path.exists(self.FIFO_IN_PATH):
			try:
				os.mkfifo(self.FIFO_IN_PATH)
			except OSError as e:
				print("shgikusdhkjfg",e)
				return False
		try:
			self.fifo_in = os.open(self.FIFO_IN_PATH, os.O_RDONLY | os.O_NONBLOCK)
			self.epoll = select.epoll()
			self.epoll.register(self.fifo_in,select.EPOLLIN)
		except OSError as e:
			print("sfkingldkfngmdfg",e)
			return False
		return True

	def openFIFO_out(self):
		if not os.path.exists(self.FIFO_OUT_PATH):      
			try:
				os.mkfifo(self.FIFO_OUT_PATH)
			except OSError as e:
				print("fail to create FIFO_OUT:", e)
				return False
		try:
			self.fifo_out = os.open(self.FIFO_OUT_PATH, os.O_RDWR | os.O_NONBLOCK)
		except OSError:
			return False
		return True

	def polling(self):
		
		try:
			while True:
				events = self.epoll.poll()
				fileno, event = events[0]
				if fileno == self.fifo_in and event & select.POLLIN:
					msg_size = decode_msg_size(os.read(self.fifo_in,4))
					self.receiveMSG(os.read(self.fifo_in,msg_size))
				elif fileno == self.fifo_in and  event & select.POLLHUP:
					self.epoll.unregister(self.fifo_in)
					self.epoll.close()
					os.close(self.fifo_in)
					self.openFIFO_in()
		finally:
			self.epoll.unregister(self.fifo_in)
			self.epoll.close()
			os.close(self.fifo_in)
	
	def receiveMSG(self,msg):
		print("receiveMSG",msg)
		self.response = msg
		self.waitForResponse = False

	def threadStart(self):
		th = threading.Thread(target=self.polling)
		th.start()

	def start(self):
		os.write(self.fifo_out,create_msg(strToBstr("print")))
		while self.waitForResponse:
			pass
		self.waitForResponse = True
		return self.response

	def pause(self):
		os.write(self.fifo_out,create_msg(strToBstr("pause")))
	def stop(self):
		os.write(self.fifo_out,create_msg(strToBstr("stop")))
	def status(self):
		return b'{"status" : "XXX"}'
	def get_material_list(self):
		return ["temp", "final"]


