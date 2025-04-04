from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('physician', 'Physician'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')

    def __str__(self):
        return self.username


class Physician(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialisation = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        verbose_name = "Physician"

    def save(self, *args, **kwargs):
        self.user.role = 'physician'
        self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} -- {self.specialisation}"


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    physician = models.ForeignKey(Physician, on_delete=models.CASCADE, related_name="patients")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age_category = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Patient"

    def save(self, *args, **kwargs):
        self.user.role = 'patient'
        self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} -- {self.age_category}"


class PatientIllness(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="illnesses", blank=True, null=True)
    physician = models.ForeignKey(Physician, on_delete=models.CASCADE, related_name="docs", blank=True, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.user.first_name} {self.user.last_name})"
