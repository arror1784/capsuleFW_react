import sys
from django.apps import AppConfig


class PostConfig(AppConfig):
	name = 'post'

	def ready(self):
		if 'runserver' not in sys.argv:
			return True

		from .models import PrintingState

		state,is_follow = PrintingState.objects.get_or_create(id=1)

		state.state = PrintingState.READY
		state.material = None
		state.printing_name = None
		state.print_setting_name = None
		state.print_setting_time = None
		state.total_layer = 0
		state.current_layer = 0

		state.save()
