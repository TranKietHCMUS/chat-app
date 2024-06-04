from rest_framework import serializers
from .models import CustomUser, Chat

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name', 'gender', 'phone_number', 'birthday']

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'userid1', 'userid2', 'text', 'time']