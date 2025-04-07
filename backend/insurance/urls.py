from django.urls import path
from .views import FileListCreateView, FileListView, FileDeleteView, FileDetailView

urlpatterns = [
    path('files/create/', FileListCreateView.as_view(), name='file-list-create'),
    
    path('files_list/<int:user_id>/', FileListView.as_view(), name='file-list'),

    path("file/<int:fileId>/", FileDetailView.as_view(), name="doc-detail"),

    path('file/delete/<int:pk>/', FileDeleteView.as_view(), name='file-delete'),
]