from django.contrib import admin

from .models import Post, FilePrinting, Material

class FilePrintingAdmin(admin.ModelAdmin):
	list_display = ['file','create_at']

admin.site.register(Post)
admin.site.register(FilePrinting,FilePrintingAdmin)
admin.site.register(Material)
# Register your models here.
