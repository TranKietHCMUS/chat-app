from rest_framework import status
from .serializers import UserSerializer, ChatSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import CustomUser, Chat
import jwt, datetime
from .token import checkToken, generateAccessToken, generateRefreshToken

af = open("access_key.txt", "r")
access_key = af.read()

rf = open("refresh_key.txt", "r")
refresh_key = rf.read()

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

        check_online = (user.is_active == 1)
        
        if (check_online):
            return Response({'detail':'This account is being logged in elsewhere.'}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = generateAccessToken(user)
        rf_token = generateRefreshToken(user)

        user.is_active = 1
        user.refresh_token = rf_token
        user.save()

        response = Response()
        response.set_cookie(key='refreshToken', value=rf_token, httponly=True, path='/', samesite='strict', secure=False)

        serializer = UserSerializer(instance=user)

        response.data = {
            'user': serializer.data,
            'accessToken': access_token,
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
        # res = checkToken(request)
        # if (res != 1):
        #     return res    
        try:
            response = Response()

            user = CustomUser.objects.filter(id=request.query_params['user_id']).first()
            user.is_active = 0
            user.refresh_token = ""
            user.save()

            response.delete_cookie('refreshToken')

            response.data = {
                'detail': 'success'
            }
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FindUser(APIView):
    def get(self, request):
        res = checkToken(request)
        if (res != 1):
            return res
            
        try:
            user  = CustomUser.objects.filter(username=request.query_params.get('username')).first()
            return Response({'detail': 'ok'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BoxChat(APIView):
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

            return Response({'data1': serializer1.data, 'data2': serializer2.data}, status=status.HTTP_200_OK)
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

class RefreshToken(APIView):
    def get(self, request):
        print(request.COOKIES)
        if ('refreshToken' not in request.COOKIES):
            return Response({'detail':'You\'re not authenticated!'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refreshToken = request.COOKIES.get('refreshToken')

            payload = jwt.decode(refreshToken, refresh_key, algorithms=['HS256']) 
            user = CustomUser.objects.filter(id=payload['user_id']).first()

            if (refreshToken != user.refresh_token):
                return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)

            newAccessToken = generateAccessToken(user)
            newRefreshToken = generateRefreshToken(user)

            user.refresh_token = newRefreshToken
            user.save()

            response = Response()
            response.set_cookie(key='refreshToken', value=newRefreshToken, httponly=True, secure=False, path='/', samesite='strict')
            response.data = {
                'accessToken': newAccessToken
            }

            return response


        except jwt.ExpiredSignatureError:
            return Response({'detail':'Token has exprised!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)

        