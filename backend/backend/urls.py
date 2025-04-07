from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('userauth.urls')),
    path('chat/', include('chat.urls')),
    path('insurance/', include('insurance.urls')),
]
