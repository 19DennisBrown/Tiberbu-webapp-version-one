from django.contrib import admin
from .models import Patient, PatientIllness,Physician
# # Register your models here.


admin.site.register(Physician)
admin.site.register(PatientIllness)
admin.site.register(Patient)
# admin.site.register(StudentProject)

