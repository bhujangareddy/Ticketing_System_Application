from rest_framework import serializers
from .models import Ticket, Category
from django.contrib.auth.models import User
            
class CategorySerializer(serializers.ModelSerializer):
    # This make each category object to have the id and name fields in it
    class Meta:
        model = Category
        fields = ['id', 'name'] 

class TicketReadSerializer(serializers.ModelSerializer):
    # This is for reading the tickets data from the DB
    categories = CategorySerializer(many=True, read_only=True)
    assignee = serializers.CharField(source="assignee.username", read_only=True)
    reporter = serializers.CharField(source="reporter.username", read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "estimated_time",
            "status",
            "priority",
            "categories",   # [{id, name}]
            "meeting_time",
            "assignee",
            "reporter",
            "due_date",
            "created_at",
            "updated_at",
        ]

class TicketWriteSerializer(serializers.ModelSerializer):
    # This is for writing or udpating the data in DB
    categories = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        required=False,
    )
    
    assignee = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "estimated_time",
            "status",
            "priority",
            "categories",   # expects IDs
            "meeting_time",
            "assignee",
            "due_date",
        ]
        read_only_fields = ["id"]

    def validate_categories(self, value):
        if value is None:
            return value
        if not (1 <= len(value) <= 3):
            raise serializers.ValidationError(
                "Select at least 1 and at most 3 categories."
            )
        return value
    
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = (
            "Admin"
            if self.user.groups.filter(name="Admin").exists()
            else "User"
        )
        return data
