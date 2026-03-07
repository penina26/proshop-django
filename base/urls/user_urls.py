from django.urls import path
from base.views import user_views as views
from base.views.user_views import MyTokenObtainPairView

urlpatterns = [    
    path('', views.getUsers, name='users'), 
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('register/', views.registerUser, name='register'),    
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
  
]