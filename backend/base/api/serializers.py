from rest_framework.serializers import ModelSerializer
from base.models import Note



class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


from rest_framework import serializers
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)  # Ensure the password is hashed
        user.save()
        return user
