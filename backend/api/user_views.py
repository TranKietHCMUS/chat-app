from rest_framework import status
from .serializers import UserSerializer, ChatSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import CustomUser, Chat
import jwt
from .token import checkToken, generateAccessToken, generateRefreshToken

af = open("access_key.txt", "r")
access_key = af.read()

rf = open("refresh_key.txt", "r")
refresh_key = rf.read()

class FindUser(APIView):
    def get(self, request):
        res = checkToken(request)
        if (res != 1):
            return res
            
        try:
            user  = CustomUser.objects.filter(username=request.query_params.get('username')).first()
            serializer = UserSerializer(instance=user)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RefreshToken(APIView):
    def get(self, request):
        if ('refreshToken' not in request.COOKIES):
            return Response({'detail':'You\'re not authenticated!'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refreshToken = request.COOKIES.get('refreshToken')

            payload = jwt.decode(refreshToken, refresh_key, algorithms=['HS256']) 
            user = CustomUser.objects.filter(id=payload['user_id']).first()

            if (refreshToken != user.refresh_token):
                return Response({'detail':'You\'re not authenticated!'}, status=status.HTTP_401_UNAUTHORIZED)

            newAccessToken = generateAccessToken(user)
            newRefreshToken = generateRefreshToken(user)

            user.refresh_token = newRefreshToken
            user.save()

            response = Response()
            response.set_cookie(key='refreshToken', value=newRefreshToken, httponly=True, secure=False, path='/', samesite=None)
            response.data = {
                'accessToken': newAccessToken
            }
            return response

        except jwt.ExpiredSignatureError:
            res = Response({'detail':'Token is expired!'}, status=status.HTTP_401_UNAUTHORIZED)
            res.delete_cookie('refreshToken')
            return res
        except jwt.InvalidTokenError:
            return Response({'detail':'You\'re not authenticated!'}, status=status.HTTP_401_UNAUTHORIZED)