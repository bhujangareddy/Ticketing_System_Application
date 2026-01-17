from django.urls import path
from accounts import views as UserViews
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', UserViews.RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # I removed the default path at which it starts with 'api/', because i already have that api/ path from base url path, which is imported in line 1
    # i.e., we are using the path in urls.py file of ticketing_system
    
    path('protected-view/', UserViews.ProtectedView.as_view()),
    # path(''),
]