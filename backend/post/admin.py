from django.contrib import admin
from django.conf.locale.es import formats as es_formats

from .models import Post, FilePrinting, Material, PrintingState

es_formats.DATETIME_FORMAT = "d M Y H:i:s"

class FilePrintingAdmin(admin.ModelAdmin):
	list_display = ['file','create_at']

@admin.register(PrintingState)
class PrintingStateAdmin(admin.ModelAdmin):
	list_display = ['id', 'state', 'material', 'printing_name','printing_folder_name', 'print_setting_name', 'total_layer', 'current_layer']
	list_display_links = ['id', 'state', 'material', 'printing_name','printing_folder_name', 'print_setting_name', 'total_layer', 'current_layer']
#admin.site.register(Post)
admin.site.register(FilePrinting,FilePrintingAdmin)
admin.site.register(Material)
# Register your models here.
