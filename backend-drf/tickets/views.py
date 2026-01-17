from django.shortcuts import render
from .models import Ticket
from rest_framework import generics, permissions
from .models import Category
from .serializers import CategorySerializer, TicketReadSerializer, TicketWriteSerializer, CustomTokenSerializer
from rest_framework.permissions import BasePermission
from .permissions import IsAdmin, IsUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response

class IsReporter(BasePermission):
    # This checks whether the requested user is equal to the current reporter
    def has_object_permission(self, request, view, obj):
        return obj.reporter == request.user

class TicketCreate(generics.CreateAPIView):
    # API Endpoint logic to create a ticket
    serializer_class = TicketWriteSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        print("RAW DATA:", self.request.data)
        print(serializer.validated_data)
        serializer.save(reporter=self.request.user)

class TicketList(generics.ListAPIView):
    # API Endpoint that gives the respective tickets data to user or admin
    serializer_class = TicketReadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Admin -> All tickets
        if user.groups.filter(name="Admin").exists():
            return Ticket.objects.all()
        
        # User -> Only asssigned tickets
        if user.groups.filter(name="User").exists():
            return Ticket.objects.filter(assignee=user)
        
        # fallback safer
        return Ticket.objects.none()
   
class TicketDetail(generics.RetrieveAPIView):
    # API Endpoint that gives a detailed view of a ticket
    serializer_class = TicketReadSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated] 
    
    def get_queryset(self):
        user = self.request.user
        
        if user.groups.filter(name="Admin").exists():
            return Ticket.objects.all()

        if user.groups.filter(name="User").exists():
            return Ticket.objects.filter(assignee=user)

        return Ticket.objects.none() 
    
class TicketUpdate(generics.RetrieveUpdateAPIView):
    # API Endpoint that a ticket record to be updated only by the Admin
    serializer_class = TicketWriteSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        user = self.request.user
        # if user.groups.filter(name="Admin").exists():
        return Ticket.objects.all();
        # return Ticket.objects.filter(reporter=user)
    
    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            TicketReadSerializer(instance).data
        )
        
class TicketDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a ticket record to be deleted only by the Admin
    serializer_class = TicketReadSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name="Admin").exists():
            return Ticket.objects.all()
        # return Ticket.objects.filter(reporter=user)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer