from django.db import models

# Create your models here.
from userauth.models import User



class File(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    insurance_company = models.CharField( max_length = 300)
    file_name = models.CharField( max_length = 200)
    file  = models.FileField( upload_to = 'insurance_files')
    uploaded_at = models.DateTimeField( auto_now_add  = True)
    
    
    def __str__(self):
        return self.file_name
