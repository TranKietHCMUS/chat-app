from rest_framework import status
from .serializers import UserSerializer, ChatSerializer, OnlineSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import CustomUser, Chat, Online
import jwt, datetime

fps = open("./api/secret_key.txt", "r")
secret_key = fps.read()

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

        check_online = Online.objects.filter(user_id=serializer.data['id']).first()
        
        if (check_online):
            return Response({'detail':'This account is being logged in elsewhere.'}, status=status.HTTP_401_UNAUTHORIZED)

        access_payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            'iat': datetime.datetime.utcnow()
        }

        access_token = jwt.encode(access_payload, secret_key, algorithm='HS256')

        refresh_payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1440),
            'iat': datetime.datetime.utcnow()
        }

        _refresh_token = jwt.encode(refresh_payload, secret_key, algorithm='HS256')

        online_user_data = {
            'user_id': serializer.data['id'],
            'refesh_token': _refresh_token
        }
        online_user_serializer = OnlineSerializer(data=online_user_data)
        if (online_user_serializer.is_valid()):
            online_user_serializer.save()

        response = Response()
        response.set_cookie(key='access_token', value=access_token, httponly=True, max_age=900)

        response.data = {
            'user': serializer.data,
            'token': access_token,
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

class UserLogout(APIView):
    def get(self, request):
        try:
            response = Response()
            response.delete_cookie('access_token')

            online_user = Online.objects.filter(user_id=request.query_params.get('user_id')).first()
            online_user.delete()

            response.data = {
                'detail': 'success'
            }

            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FindUser(APIView):
    def get(self, request):
        try:
            token = request.headers['Authorization'][7:]
            payload = jwt.decode(token, secret_key, algorithms=['HS256']) 
            if "user_id" not in payload:
                return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)
            
            try:
                user  = CustomUser.objects.filter(username=request.query_params.get('username')).first()
                serializer = CustomUser(instance=user)
                return Response({'detail': 'ok'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except jwt.ExpiredSignatureError:
            return Response({'detail':'Token has exprised!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)

class BoxChat(APIView):
    def post(self, request):
        try:
            token = request.headers['Authorization'][7:]
            payload = jwt.decode(token, secret_key, algorithms=['HS256']) 
            if "user_id" not in payload:
                return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = ChatSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'Chat': 'successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except jwt.ExpiredSignatureError:
            return Response({'detail':'Token has exprised!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)
        
    def get(self, request):
        try:
            token = request.headers['Authorization'][7:]
            payload = jwt.decode(token, secret_key, algorithms=['HS256']) 
            if "user_id" not in payload:
                return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)
            
            try:
                user1 = request.query_params.get('user_id1')
                user2 = request.query_params.get('user_id2')

                data1 = Chat.objects.filter(user_id1=user1, user_id2=user2)
                data2 = Chat.objects.filter(user_id1=user2, user_id2=user1)

                serializer1 = ChatSerializer(instance=data1, many=True)
                serializer2 = ChatSerializer(instance=data2, many=True)

                return Response({'data1': serializer1.data, 'data2': serializer2.data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except jwt.ExpiredSignatureError:
            return Response({'detail':'Token has exprised!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)


class FindUserChats(APIView):
    def get(self, request):
        try:
            token = request.headers['Authorization'][7:]
            payload = jwt.decode(token, secret_key, algorithms=['HS256']) 
            if "user_id" not in payload:
                return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)
            
            users = CustomUser.objects.exclude(id=request.query_params.get('user_id'))
            serializer = UserSerializer(instance=users, many=True)
            user_names = [user['first_name'] + " " + user['last_name'] for user in serializer.data]
            return Response({'user_chats': user_names}, status=status.HTTP_200_OK)
        
        except jwt.ExpiredSignatureError:
            return Response({'detail':'Token has exprised!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)