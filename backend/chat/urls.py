
from django.urls import path
from . import views



urlpatterns = [
    # Fetch messages
    path('chat_messages/<int:patient_id>/<int:physician_id>/', views.get_chat_messages, name = 'messages'),
    
    # Create messages
    path('chat_messages/create/', views.create_chat_message, name = 'create_message'),
]