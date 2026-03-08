from django.urls import path
from base.views import user_views as views
from base.views.user_views import MyTokenObtainPairView

urlpatterns = [    
    path('', views.getUsers, name='users'), 
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('register/', views.registerUser, name='register'),  
    path('', views.getUsers, name="users"),  
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('<str:pk>/', views.getUserById, name='user'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
  
]