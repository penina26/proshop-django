from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema
from base.models import Product, User
from base.serializers import (
      MyTokenObtainPairSerializer,
      ProductSerializer, 
      UserSerializer,
      UserSerializerWithToken,
      RegisterSerializer,
      UserUpdateSerializer)
from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@extend_schema(request=RegisterSerializer, responses=UserSerializerWithToken)
@api_view(['POST'])
def registerUser(request):
    data = request.data
   
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return Response(
            {'detail': 'Email and Password are required to register.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.create(
            first_name=name if name else '', # Fallback to empty string if no name is provided
            username=email,
            email=email,
            password=make_password(password)
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'detail': 'User with this email already exists.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
   
# update a user
@extend_schema(request=UserUpdateSerializer, responses=UserSerializerWithToken)
@api_view(['PUT']) 
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data.get('name', user.first_name)
    user.username = data.get('email', user.username)
    user.email = data.get('email', user.email)

    if data.get('password') and data.get('password') != '':
        user.set_password(data.get('password'))

    user.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)