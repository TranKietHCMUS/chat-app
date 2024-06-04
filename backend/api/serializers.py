from rest_framework import serializers
from .models import CustomUser, Chat, Online

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name', 'gender', 'phone_number', 'birthday']

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'userid1', 'userid2', 'text', 'time']

class OnlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Online
        fields = '__all__'