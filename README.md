# Ticketing_System_Application
Note: For better readablity switch to code tab in just above top left
This project contains a Django REST Backend and a React (Vite) Frontend with Role-Based Access Control (Admin/User).

Backend Setup (Django + DRF):
1. Prerequisites:
Python 3.10+
pip
virtualenv (recommended)

2️. Create & Activate Virtual Environment:
Windows:
cd backend-drf
python -m venv env
env\Scripts\activate

macOS / Linux:
cd backend-drf
python3 -m venv env
source env/bin/activate

3️. Install Backend Dependencies
pip install Django 
pip install djangorestframework 
pip install djangorestframework-simplejwt
pip install python-decouple
pip install django-cors-headers

4️. Environment Variables (.env)
Create a .env file inside backend-drf/
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=ticketing_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

If you want to use SQLite, you can skip above DB variables in .env

5️. Database Setup
Option A️: SQLite (Default – Easy)
No extra setup needed.
Option B️: PostgreSQL (Recommended)
Create database:
CREATE DATABASE ticketing_db;

Update settings.py:
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}

6️. Apply Migrations
python manage.py makemigrations
python manage.py migrate

7️. Create Superuser (Admin)
python manage.py createsuperuser

8️. Create User Roles (IMPORTANT) (or) Create manually using default admin panel provided by django
Run Django shell:
python manage.py shell

from django.contrib.auth.models import Group

Group.objects.get_or_create(name="Admin")
Group.objects.get_or_create(name="User")

9️. Assign Role to Users (or) use the admin panel
from django.contrib.auth.models import User, Group

admin_group = Group.objects.get(name="Admin")
user_group = Group.objects.get(name="User")

admin = User.objects.get(username="admin")
admin.groups.add(admin_group)

Newly registered users can be auto-assigned to User role.
10. Populate Categories (One-Time)
python manage.py shell

from tickets.models import Category, Categories

for choice in Categories:
    Category.objects.get_or_create(name=choice.value)

Now it is safe to run:
1️. Run Backend Server
python manage.py runserver

Backend runs at:
[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

Frontend Setup (React + Vite)
1️. Prerequisites
Node.js 18+
npm or yarn

2️. Install Frontend Dependencies
cd frontend
npm install

3️. Environment Variables
Create .env inside frontend/
VITE_API_BASE_URL=http://127.0.0.1:8000

4️. Run Frontend
npm run dev

Frontend runs at:
http://localhost:5173

Authentication Flow:

JWT Authentication using SimpleJWT
Login endpoint:
POST /api/token/

Response includes:
{
  "access": "...",
  "refresh": "...",
  "role": "Admin | User"
}

Token is stored in localStorage and sent via:
Authorization: Bearer <token>

Role Behavior Summary:

RolePermissions:
Admin: Create, Assign, Update, Delete, View All Tickets
User: View only tickets assigned to them
