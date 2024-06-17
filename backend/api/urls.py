from django.urls import path
from . import auth_views, user_views, chat_views

urlpatterns = [
    path('auth/login/', auth_views.UserLogin.as_view(), name='login'),
    path('auth/register/', auth_views.UserRegister.as_view(), name='register'),
    path('auth/logout/', auth_views.UserLogout.as_view(), name='logout'),
    path('user/finduser/', user_views.FindUser.as_view(), name='find-user'),
    path('user/refresh/', user_views.RefreshToken.as_view(), name='refresh-token'),
    path('chat/messages/', chat_views.Messages.as_view(), name='messages'),
    path('chat/finduserchats/', chat_views.FindUserChats.as_view(), name='find-user-chats'),
]