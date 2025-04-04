

from rest_framework import serializers
from userauth.models import User, Patient, Physician
from userauth.serializers import UserSerializer

from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer( read_only = True)
    
    patient = serializers.PrimaryKeyRelatedField( queryset= Patient.objects.all())
    physician = serializers.PrimaryKeyRelatedField( queryset= Physician.objects.all())
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'patient', 'physician', 'content', 'created_at', 'modified_at']
        
        
    def create(self, validated_data):
        user = self.context['request'].user
        
        chat_message = ChatMessage.objects.create(
            user=user,
            patient = validated_data.get('patient'),
            physician = validated_data.get('physician'),
            content = validated_data.get('content'),
        )
        
        return chat_message