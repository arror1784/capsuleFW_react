from django.urls import path
from post.views import get_csrf
urlpatterns = [
    path('get_csrf/', get_csrf),
]

