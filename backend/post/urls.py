from django.urls import path

from . import views, materialViews,fileViews

urlpatterns = [
	path('', views.ListPost.as_view()),
	path('<int:pk>/', views.DetailPost.as_view()),
	path('get_csrf/', views.get_csrf),
	
	path('state/',views.printerState),

	path('file/upload/',fileViews.file),
	
#path('material/',views.materialList),
	path('material/',materialViews.materialList),
	path('material/<slug:materialName>/info/',materialViews.materialInfo),
	path('material/<slug:materialName>/select/',materialViews.materialSelect),
	
	path('start/',views.startPrint),
]

