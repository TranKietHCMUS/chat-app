from django.db.models import Q
from rest_framework import status
from .serializers import UserSerializer, ChatSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import CustomUser, Chat
from .token import checkToken

class Messages(APIView):
    def post(self, request):
        res = checkToken(request)
        if (res != 1):
            return res
        
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'Chat': 'successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        res = checkToken(request)
        if (res != 1):
            return res
        try:
            user1 = request.query_params.get('user_id1')
            user2 = request.query_params.get('user_id2')

            data = Chat.objects.filter((Q(user_id1=user1) & Q(user_id2=user2)) | (Q(user_id1=user2) & Q(user_id2=user1))).order_by('time')

            serializer = ChatSerializer(instance=data, many=True)

            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FindUserChats(APIView):
    def get(self, request):
        res = checkToken(request)
        if (res != 1):
            return res
        
        users = CustomUser.objects.exclude(id=request.query_params.get('user_id'))
        serializer = UserSerializer(instance=users, many=True)
        return Response({'user_chats': serializer.data}, status=status.HTTP_200_OK)