from django.contrib.auth.models import AbstractUser
from django.db import models




class User(AbstractUser):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('physician', 'Physician'),
    ]
    role = models.CharField(max_length = 20, choices = ROLE_CHOICES, default = 'student')
    
    def __str__(self):
        return self.username
    
    # Physician model
class Physician(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key = True)
    first_name = models.CharField(max_length = 100)
    last_name = models.CharField(max_length = 100)
    specialisation = models.CharField(max_length = 50)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} -- {self.specialisation}"
    
    class Meta:
        verbose_name = "Physician"
        
    def save(self, *args, **kwargs):
        self.user.role = 'physician'
        self.user.save()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.user.username
    
    
# Patient model
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key = True)
    physician = models.ForeignKey(Physician, on_delete = models.CASCADE, related_name = "patients")
    first_name = models.CharField(max_length = 100)
    last_name = models.CharField(max_length = 100)
    age_category = models.CharField(max_length = 50)    
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} -- {self.age_category}"
    
    class Meta:
        verbose_name = "Patient"
    
    def save(self, *args, **kwargs):
        self.user.role = 'patient'
        self.user.save()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.user.username
    
    
# Patient Illness
class PatientIllness(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE, primary_key = True)
    title = models.CharField(max_length = 100)
    description = models.TextField()
    
    def __str__(self):
        return self.title