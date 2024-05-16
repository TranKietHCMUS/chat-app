from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from .serializers import UserSerializer, MessageSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import CustomUser, Message


# Create your views here.
class UserLogin(APIView):
    def post(self, request):
        user = get_object_or_404(CustomUser, username=request.data['username'])
        
        if not user.check_password(request.data['password']):
            return Response({'detail':'Wrong Password.'}, status=status.HTTP_401_UNAUTHORIZED)
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)

class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = CustomUser.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            token = Token.objects.create(user=user)
            return Response({'Token':token.key, 'user':serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserLogout(APIView):
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BoxChat(APIView):
    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        try:
            user1 = request.data['username1']
            user2 = request.data['username2']

            data1 = Message.objects.filter(username1=user1, username2=user2)
            data2 = Message.objects.filter(username1=user2, username2=user1)

            serializer1 = MessageSerializer(instance=data1, many=True)
            serializer2 = MessageSerializer(instance=data2, many=True)

            return Response({'data1': serializer1.data, 'data2': serializer2.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
