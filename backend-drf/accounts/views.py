from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics, viewsets
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class RegisterView(generics.CreateAPIView): # This CreateAPIView is used to add the User objects into the DB
    queryset = User.objects.all() # This fetches the all users of User model/table, where it uses a postgres query internally 
    serializer_class = UserSerializer
    # permission_classes = [AllowAny] # This statement makes our RegisterView class accessable to every user, where AllowAny is a class of permissions sub-package of main package rest_framework
    permission_classes = [] # This same as the above statement

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        response = {
            'status': 'Request was permitted'
        }
        
        return Response(response)
   
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer  
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data) 
    
class UserByUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)