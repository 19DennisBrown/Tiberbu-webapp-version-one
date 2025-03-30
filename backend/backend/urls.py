from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('base.api.urls')),
    path('user/', include('userauth.urls'))
]
