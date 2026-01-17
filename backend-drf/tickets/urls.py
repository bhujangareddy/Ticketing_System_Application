from django.urls import include, path
from .views import TicketCreate, TicketList, TicketDetail, TicketUpdate, TicketDelete, CategoryListView

urlpatterns = [
    path('create/', TicketCreate.as_view(), name='create-ticket'),
    path('', TicketList.as_view()),
    path('<uuid:id>/', TicketDetail.as_view(), name='retrieve-ticket'),
    path('update/<uuid:id>/', TicketUpdate.as_view(), name='update-ticket'),
    path('delete/<uuid:id>/', TicketDelete.as_view(), name='delete-ticket'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]