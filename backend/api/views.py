from rest_framework import generics, status
from .serializers import UserSerializer, MessageSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import CustomUser, Message
import jwt, datetime


# Create your views here.
class UserLogin(APIView):
    def post(self, request):
        if 'username' not in request.data or 'password' not in request.data:
            return Response({'detail': 'You must fill in username and password.'}, status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.filter(username=request.data['username']).first()

        if not user:
            return  Response({'detail': 'An account is not exists!'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(request.data['password']):
            return Response({'detail':'Wrong Password.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = UserSerializer(instance=user)

        payload = {
            'username': user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'user': serializer.data
        }

        return response

class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = CustomUser.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            return Response({'user':serializer.data})
        for error in serializer.errors:
            if serializer.errors[error][0] == "This field may not be blank.":
                return Response({'detail': 'You must fill in all the infomation.'}, status=status.HTTP_400_BAD_REQUEST)
        if 'email' in serializer.errors:
            return Response({'detail' : serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
        if 'username' in serializer.errors:
            return Response({'detail' : serializer.errors['username'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail' : str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            return Response({'detail': 'Unauthenticated!'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'detail': 'Unauthenticated!'}, status=status.HTTP_401_UNAUTHORIZED)

        user = CustomUser.objects.filter(username=payload['username']).first()
        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class UserLogout(APIView):
    def get(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'detail': 'success'
        }
        return response

class BoxChat(APIView):
    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        try:
            user1 = request.query_params.get('username1')
            user2 = request.query_params.get('username2')

            data1 = Message.objects.filter(username1=user1, username2=user2)
            data2 = Message.objects.filter(username1=user2, username2=user1)

            serializer1 = MessageSerializer(instance=data1, many=True)
            serializer2 = MessageSerializer(instance=data2, many=True)

            return Response({'data1': serializer1.data, 'data2': serializer2.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FindUserChats(APIView):
    def get(self, request):
        name = request.query_params.get('username')

        users = CustomUser.objects.exclude(username=name)

        serializer = UserSerializer(instance=users, many=True)

        user_names = [user['first_name'] + " " + user['last_name'] for user in serializer.data]

        return Response({'user_chats': user_names}, status=status.HTTP_200_OK)