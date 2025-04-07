from rest_framework import serializers 
from .models import File




class FileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only  = True)
    
    class Meta:
        model = File
        fields = [ 'id', 'user', 'insurance_company', 'file_name', 'file', 'uploaded_at']
        read_only_fields = ['uploaded_at']