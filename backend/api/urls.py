from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.UserLogin.as_view(), name='login'),
    path('auth/register/', views.UserRegister.as_view(), name='register'),
    path('auth/logout/', views.UserLogout.as_view(), name='logout'),
    path('user/finduser/', views.FindUser.as_view(), name='find-user'),
    path('chat/boxchat/', views.BoxChat.as_view(), name='box-chat'),
    path('chat/finduserchats/', views.FindUserChats.as_view(), name='find-user-chats'),
    path('token/refresh/', views.RefreshToken.as_view(), name='refresh-token')
]