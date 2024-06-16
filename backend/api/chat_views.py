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

            data1 = Chat.objects.filter(user_id1=user1, user_id2=user2)
            data2 = Chat.objects.filter(user_id1=user2, user_id2=user1)

            serializer1 = ChatSerializer(instance=data1, many=True)
            serializer2 = ChatSerializer(instance=data2, many=True)

            return Response({'send': serializer1.data, 'receive': serializer2.data}, status=status.HTTP_200_OK)
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