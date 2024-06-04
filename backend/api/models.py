from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# # Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email is not given')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff = True')
        
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser = True')
        
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30, null=True)
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    birthday = models.DateField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True)
    gender = models.CharField(max_length=10, null=True)
    is_staff = models.BooleanField(default=False, null=True)
    is_superuser = models.BooleanField(default=False, null=True)
    is_active = models.BooleanField(default=False, null=True)
    refresh_token = models.CharField(max_length=256, null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.email
    
class Chat(models.Model):
    user_id1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user1')
    user_id2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user2')
    text = models.CharField(max_length=500)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id1.username} - {self.user_id2.username}"