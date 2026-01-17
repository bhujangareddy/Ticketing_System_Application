from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MinLengthValidator, MaxLengthValidator, MinValueValidator, MaxValueValidator
import uuid

STATUS_CHOICES = [
    ('ToDo', 'ToDo'), # first ele is stored in Ticket Table/Model in DB
    ('InProgress', 'InProgress'), # second ele is displayed to the user in the admin panel
    ('Done', 'Done'),
]

PRIORITY_CHOICES = [
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High')
]

class Categories(models.TextChoices):
        BUG = "Bug", "Bug"
        FRONTEND = "Frontend", "Frontend"
        BACKEND = "Backend", "Backend"
        DATABASE = "Database", "Database"
        TESTING = "Testing", "Testing"
        ERROR = "Error", "Error"

def validate_not_past_date(value):
    if value < timezone.now().date():
        raise ValidationError("Due date cannot be a past date.")

# def validate_not_past_time_today(value):
#     if value < timezone.now().time():
#         raise ValidationError("Meeting time cannot be a past time on the current day.")

class Category(models.Model):
    name = models.CharField(
        max_length=20,
        choices=Categories.choices,
        unique=True,
    )  
    
    def __str__(self):
        return self.name  

class Ticket(models.Model):
    class Meta:
        permissions = [
            ("can_assign_ticket", "Can assign ticket"),
            ("can_view_all_tickets", "Can view all tickets"),
        ]
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    
    title = models.CharField(
        "Title", 
        max_length=25,
        validators=[MinLengthValidator(3), MaxLengthValidator(25)],
    )
    
    description = models.TextField(
        null=True,
        blank=True,
        max_length=100,
        validators=[MaxLengthValidator(100)],
    )
    
    estimated_time = models.IntegerField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0), MaxValueValidator(40)],
    )
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='ToDo',
        # db_default='ToDo', 
    )
    
    priority = models.CharField(
        max_length=6,
        choices=PRIORITY_CHOICES,
        default="Medium",
        # db_default="Medium",
    )
    
    categories = models.ManyToManyField(
        Category,
        blank=False,
    )
    
    meeting_time = models.TimeField(
        # input_formats=["%H:%M:%S"],
        blank=True,
        null=True,
        # validators=[validate_not_past_time_today],
        # Actually, i should use an instance method logic in line 124, which handles the all edge cases automatically when the Ticket instance is created or updated
    )
    
    due_date = models.DateField(
        null=True, 
        blank=True, 
        validators=[validate_not_past_date],
        # help_text="Past Date cannot be selected or disabled",
    )
    
    # This is the ForeignKey field that links to the default User model
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  
        null=True,                 # Allow the field to be null (optional assignment)
        blank=True,                # Allow the field to be blank in forms
        related_name='assigned_tickets' # Name to use for the reverse relation from User
    )
    
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reported_tickets',
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        # default=timezone.now, is assigned automatically by django, only when the ticket is created at first time
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        # default=timezone.now, is assigned automatically by django, only when the ticket is created at each time of updating the ticket details
    )
    
    def clean(self):
        super().clean()
        
        # meeting time validation
        if self.meeting_time and self.due_date:
            if self.due_date == timezone.now().date():
                if self.meeting_time < timezone.now().time():
                    raise ValidationError({
                        "meeting_time": "Meeting time cannot be in the past for today."
                    })  
    
    def save(self, *args, **kwargs):
        # self.full_clean()
        super().save(*args, **kwargs)
        
    
    def __str__(self):
        return self.title