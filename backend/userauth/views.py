from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, HttpResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import Physician, Patient, PatientIllness
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import AllowAny

from .models import User, Patient, PatientIllness,Physician
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    PatientSerializer,
    PhysicianSerializer,
    PatientIllnessSerializer
)

# TOKEN OBTAIN VIEW
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['username'] = user.username
        token['role'] = user.role  # Add the user's role

        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/user/register',
        '/user/token',
        '/user/token/refresh',
    ]

    return Response(routes)

# USER REGISTRATION VIEW
class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Registration successful!",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,  # Include role in response
                }
            }, status=201)

        print("Serializer errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=400)
    
class CreatePhysicianAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Get the incoming user data from the request
        physician_data = request.data
        
        # Validate and create the user
        physician_serializer = UserSerializer(data=physician_data)
        if physician_serializer.is_valid():
            user = physician_serializer.save()

        physician_serializer = PhysicianSerializer(
            data=physician_data, context={'request': request}
        )

            # Validate and create the Physician profile
        if physician_serializer.is_valid():
            physician_serializer.save()
            return Response({"message": "Physician created successfully!"}, status=status.HTTP_201_CREATED)
    
    # If the user serializer is invalid, return errors
        return Response(physician_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py
class UpdatePhysicianAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        try:
            # Get physician by the authenticated user's ID
            physician = Physician.objects.get(user_id=request.user.id)
        except Physician.DoesNotExist:
            return Response(
                {"error": "Physician profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Only allow updating specific fields
        allowed_fields = ['first_name', 'last_name', 'specialisation']
        data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        serializer = PhysicianSerializer(
            physician,
            data=data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Physician profile updated successfully",
                    "physician": serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreatePatientAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        patient_data = request.data.copy()
        
        # Get physician user_id from request
        physician_user_id = patient_data.get('physician')
        if not physician_user_id:
            return Response(
                {"error": "Physician user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            physician = Physician.objects.get(user_id=physician_user_id)
        except Physician.DoesNotExist:
            return Response(
                {"error": "Physician not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Add physician's user_id to patient data
        patient_data['physician'] = physician.user_id
        
        patient_serializer = PatientSerializer(
            data=patient_data,
            context={'request': request}
        )
        
        if patient_serializer.is_valid():
            patient = patient_serializer.save()
            return Response(
                {
                    "message": "Patient profile created successfully!",
                    "patient_id": patient.user_id
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            patient_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
def list_physicians(request):
    physicians = Physician.objects.filter().values("user_id", "first_name", "last_name", "specialisation")
    return JsonResponse(list(physicians), safe=False)




class PhysicianProfileView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        try:
            physician = Physician.objects.select_related('user').get(user_id=user_id)
            
            # Build the response structure exactly as expected by frontend
            response_data = {
                'first_name': physician.first_name,
                'last_name': physician.last_name,
                'physician': {
                    'first_name': physician.first_name,
                    'last_name': physician.last_name,
                    'specialisation': physician.specialisation,
                    'user': {
                        'email': physician.user.email
                    }
                },
                'user': {
                    'username': physician.user.username,
                    'email': physician.user.email
                }
            }
            
            # Add patients data if needed
            patients = Patient.objects.filter(physician=physician).select_related('user')
            if patients.exists():
                response_data['patients'] = [{
                    'first_name': p.first_name,
                    'last_name': p.last_name,
                    'user': {
                        'username': p.user.username
                    }
                } for p in patients]
            
            return Response(response_data)
            
        except Physician.DoesNotExist:
            raise NotFound("Physician not found")

class PatientProfileView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        try:
            patient = Patient.objects.select_related(
                'user', 
                'physician', 
                'physician__user'
            ).get(user_id=user_id)
            
            # Build the exact structure expected by frontend
            response_data = {
                'first_name': patient.first_name,
                'last_name': patient.last_name,
                'patient': {
                    'first_name': patient.first_name,
                    'last_name': patient.last_name,
                    'age_category': patient.age_category,
                    'physician': {
                        'first_name': patient.physician.first_name,
                        'last_name': patient.physician.last_name,
                        'specialisation': patient.physician.specialisation
                    } if patient.physician else None,
                    'user': {
                        'email': patient.user.email
                    }
                },
                'user': {
                    'username': patient.user.username,
                    'email': patient.user.email
                }
            }
            
            # Add illness data if available
            try:
                illness = PatientIllness.objects.get(user_id=user_id)
                response_data['patient_illness'] = {
                    'title': illness.title,
                    'description': illness.description
                }
            except PatientIllness.DoesNotExist:
                pass
                
            return Response(response_data)
            
        except Patient.DoesNotExist:
            raise NotFound("Patient not found")
        
# UPDATING PROFILE DATA
# FOR PATIENT:
class UpdatePatientAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            patient = Patient.objects.get(user_id=request.user.id)
        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = PatientSerializer(
            patient,
            data=request.data,
            partial=True,  # Allow partial updates
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Patient profile updated successfully!",
                    "patient": serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# ALIST OF PATIENTS BELONGING TO A GIVEN PHYSICIAN.

class PhysicianPatientDetailView(RetrieveAPIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Physician.objects.all()
    serializer_class = PhysicianSerializer
    lookup_field = "user_id"

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")  # Extract physician's user_id from URL

        try:
            # Get physician by user_id
            physician = Physician.objects.get(user_id=user_id)
            
            # Get patients who selected this physician
            patients = Patient.objects.filter(physician=physician).select_related(
                'user', 'patient_illness'
            )
            
            # Serialize physician data
            physician_data = PhysicianSerializer(physician).data
            
            # Create patient list with illnesses
            patient_list = []
            for patient in patients:
                illness_data = None
                if hasattr(patient, 'patient_illness'):
                    illness_data = PatientIllnessSerializer(patient.patient_illness).data
                
                patient_list.append({
                    "user_id": patient.user_id,
                    "first_name": patient.first_name,
                    "last_name": patient.last_name,
                    "age_category": patient.age_category,
                    "illness": illness_data
                })
            
            # Combine physician details with patient list
            response_data = {
                "physician": physician_data,
                "patients": patient_list
            }
            
            return Response(response_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Physician not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ILLNESS VIEWS TO CREATE, UPDATE AND VIEW
class PatientIllnessCreateView(CreateAPIView):
    serializer_class = PatientIllnessSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PatientIllnessUpdateView(RetrieveUpdateAPIView):
    serializer_class = PatientIllnessSerializer
    permission_classes = [IsAuthenticated]
    queryset = PatientIllness.objects.all()
    lookup_field = 'user_id'
    
    def get_object(self):
        # Ensure users can only update their own records
        return self.queryset.get(user=self.request.user)
    
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import PermissionDenied

class PatientIllnessListView(ListAPIView):
    serializer_class = PatientIllnessSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id != str(self.request.user.id):
            raise PermissionDenied("You can only view your own illness records")
        return PatientIllness.objects.filter(user_id=user_id)