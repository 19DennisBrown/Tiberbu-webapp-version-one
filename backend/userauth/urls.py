from django.urls import path
from . import views
from .views import MyTokenObtainPairView, UserRegisterView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', views.getRoutes),

    # Authentication routes
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile creation routes for:
    # physician
    path('create-profile/physician/', views.CreatePhysicianAPIView.as_view(), name='create_physician_profile'),
    # patient
    path('create-profile/patient/', views.CreatePatientAPIView.as_view(), name='create_patient_profile'),
    # Profile Updating routes for:
    # physician
    path('update-profile/physician/<int:user_id>/', views.UpdatePhysicianAPIView.as_view(), name='update_physician_profile'),
    # patient
    path('update-profile/patient/<int:user_id>/', views.UpdatePatientAPIView.as_view(), name='update_patient_profile'),

    # getting the list of physician routes:
    path('physicians/', views.list_physicians, name='list_physicians'),
    
    
    # Getting profile information
    path('patient/<int:user_id>/', views.PatientProfileView.as_view(), name='patient'),
    path('physician/<int:user_id>/', views.PhysicianProfileView.as_view(), name='physician'),

    # A list of patients belonging to a specific physician
    path('physician-patient/<int:user_id>/', views.PhysicianPatientDetailView.as_view(), name='physician-patient'),
    
    
    # URls for creating, updating and viewing.
    path('create/illness/', views.PatientIllnessCreateView.as_view(), name='illness-create'),
    path('update/illness/<int:user_id>/', views.PatientIllnessUpdateView.as_view(), name='illness-update'),
    path('illness/patient/<int:user_id>/', views.PatientIllnessListView.as_view(), name='illness-list'),

]