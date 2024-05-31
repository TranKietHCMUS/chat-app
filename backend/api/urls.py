from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.UserLogin.as_view(), name='login'),
    path('register/', views.UserRegister.as_view(), name='register'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('finduser/', views.FindUser.as_view(), name='find-user'),
    path('chat/', views.BoxChat.as_view(), name='box-chat'),
    path('user/', views.UserView.as_view(), name='user'),
    path('finduserchats/', views.FindUserChats.as_view(), name='find-user-chats')
]