from django.contrib import admin

from .models import Post, FilePrinting, Material, PrintingState

class FilePrintingAdmin(admin.ModelAdmin):
	list_display = ['file','create_at']

@admin.register(PrintingState)
class PrintingStateAdmin(admin.ModelAdmin):
	list_display = ['id', 'state', 'material', 'printing_name', 'total_layer', 'current_layer']
	list_display_links = ['id', 'state', 'material', 'printing_name', 'total_layer', 'current_layer']
#admin.site.register(Post)
admin.site.register(FilePrinting,FilePrintingAdmin)
admin.site.register(Material)
# Register your models here.
