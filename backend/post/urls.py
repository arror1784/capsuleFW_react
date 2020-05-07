from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListPost.as_view()),
    path('<int:pk>/', views.DetailPost.as_view()),
	path('test/', views.test),
	path('upload/',views.upload_file),
	path('state/',views.printerState),
	path('material/<slug:material_name>',views.material),
	path('material/list',views.materialList),
]

