from rest_framework import serializers
from .models import Physician, Patient, PatientIllness, User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='patient')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
#  Basic User data       # 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        


# Physician Serialiser
class PhysicianSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Physician
        fields = ['user_id', 'user', 'first_name', 'last_name', 'specialisation']
    
    def create(self, validated_data):
        """Handle physician profile creation"""
        user = self.context['request'].user
        
        physician = Physician.objects.create(
            user=user,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            specialisation=validated_data.get('specialisation', '')
        )
        return physician
    
    def update(self, instance, validated_data):
        """Handle physician profile updates"""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.specialisation = validated_data.get('specialisation', instance.specialisation)
        instance.save()
        return instance
    
    
# PatientIllness serializer
    


class PatientIllnessSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    physician = serializers.PrimaryKeyRelatedField(queryset=Physician.objects.all())  
    
    class Meta:
        model = PatientIllness
        fields = ['user_id', 'user', 'title', 'description', 'physician', 'created_at']
        extra_kwargs = {
            'user_id': {'read_only': True}
        }

    def create(self, validated_data):
        """Handle creation of new illness record"""
        user = self.context['request'].user
        physician = validated_data.pop('physician')  # Extract physician object, no need for get()

        # Create the PatientIllness instance with physician
        illness = PatientIllness.objects.create(
            user=user,
            physician=physician,  # Directly assign the physician object
            title=validated_data.get('title', ''),
            description=validated_data.get('description', ''),
            created_at=validated_data.get('created_at', None)
        )
        return illness

    def update(self, instance, validated_data):
        """Handle updating existing illness record"""
        physician = validated_data.pop('physician', None)  # Get physician if provided

        if physician:
            instance.physician = physician  # Directly assign the physician object

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.created_at = validated_data.get('created_at', instance.created_at)
        instance.save()
        return instance

    
class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    physician = PhysicianSerializer(read_only=True)
    patient_illness = PatientIllnessSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ['user_id', 'user', 'first_name', 'last_name', 'age_category', 'physician', 'patient_illness']
        
    def create(self, validated_data):
        user = self.context['request'].user
        physician_user_id = self.context['request'].data.get('physician')
        
        try:
            physician = Physician.objects.get(user_id=physician_user_id)
        except Physician.DoesNotExist:
            raise serializers.ValidationError({"physician": "Physician not found"})
        
        patient = Patient.objects.create(
            user=user,
            physician=physician,
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            age_category=validated_data.get("age_category", "")
        )
        
        return patient
    
    def update(self, instance, validated_data):
        # Handle physician update if provided
        physician_user_id = self.context['request'].data.get('physician')
        if physician_user_id:
            try:
                physician = Physician.objects.get(user_id=physician_user_id)
                instance.physician = physician
            except Physician.DoesNotExist:
                raise serializers.ValidationError({"physician": "Physician not found"})
        
        # Update basic fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.age_category = validated_data.get('age_category', instance.age_category)
        
        instance.save()
        return instance