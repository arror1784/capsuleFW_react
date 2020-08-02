from django.urls import path

from . import views, materialViews,fileViews

urlpatterns = [
	path('get_csrf/', views.get_csrf),
	
	path('state/',views.printerState),

	path('file/upload/',fileViews.file),
	
#path('material/',views.materialList),
	path('material/',materialViews.materialList),
	path('material/<slug:materialName>/info/',materialViews.materialInfo),
	path('material/<slug:materialName>/select/',materialViews.materialSelect),
	
	path('start/',views.startPrint),
	path('pause/',views.pause),
	path('resume/',views.resume),
	path('quit/',views.quit),


	path('test/',views.test),
]

