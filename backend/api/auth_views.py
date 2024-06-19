from rest_framework import status
from .serializers import UserSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import CustomUser, Chat
from .token import generateAccessToken, generateRefreshToken

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

        access_token = generateAccessToken(user)
        rf_token = generateRefreshToken(user)

        user.refresh_token = rf_token
        user.save()

        response = Response({'detail': 'success!'}, status=status.HTTP_200_OK)
        response.set_cookie(key='refreshToken', value=rf_token, httponly=True, path='/', 
                            samesite='strict', secure=False, max_age=86400)

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
        try:
            response = Response()

            user = CustomUser.objects.filter(id=request.query_params['user_id']).first()
            user.refresh_token = ""
            user.save()

            response.delete_cookie('refreshToken')

            response.data = {
                'detail': 'success'
            }
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        