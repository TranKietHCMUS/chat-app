import datetime
from rest_framework.response import Response
from rest_framework import status
import jwt

af = open("access_key.txt", "r")
access_key = af.read()

rf = open("refresh_key.txt", "r")
refresh_key = rf.read()

def generateAccessToken(user):
    access_payload = {
        'user_id': user.id,
        'is_superuser': user.is_superuser,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
        'iat': datetime.datetime.utcnow()
    }

    access_token = jwt.encode(access_payload, access_key, algorithm='HS256')

    return access_token

def generateRefreshToken(user):
    refresh_payload = {
        'user_id': user.id,
        'is_superuser': user.is_superuser,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=86400),
        'iat': datetime.datetime.utcnow()
    }

    refresh_token = jwt.encode(refresh_payload, refresh_key,algorithm='HS256')

    return refresh_token

def checkToken(request):
    if ('Token' not in request.headers):
        return Response({'detail':'Header doesn\'t have token!'}, status=status.HTTP_401_UNAUTHORIZED)
    try:      
        token = request.headers['Token'][7:]
        jwt.decode(token, access_key, algorithms=['HS256']) 

        return 1
         
    except jwt.ExpiredSignatureError:
        return Response({'detail':'Token has exprised!'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({'detail':'Token is not valid!'}, status=status.HTTP_401_UNAUTHORIZED)