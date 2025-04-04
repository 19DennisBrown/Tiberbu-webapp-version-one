from django.db import models

# Create your models here.
from userauth.models import Patient, User, Physician


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    physician = models.ForeignKey(Physician, on_delete=models.CASCADE, related_name="chat_messages")
    content = models.TextField(max_length = 500)
    created_at = models.DateTimeField( auto_now_add=True)
    modified_at = models.DateTimeField( auto_now_add=True)
    
    class Meta:
        ordering = ['-modified_at']
    