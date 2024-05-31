from rest_framework import serializers
from .models import CustomUser, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'first_name', 'last_name', 'gender', 'phone_number', 'birthday']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['username1', 'username2', 'text', 'time']