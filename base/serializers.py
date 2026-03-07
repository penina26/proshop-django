from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['name'] = user.first_name
        token['isAdmin'] = user.is_staff
        token['_id'] = user.id 
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['username'] = self.user.username
        data['email'] = self.user.email
        data['name'] = self.user.first_name
        data['_id'] = self.user.id
        data['isAdmin'] = self.user.is_staff
        return data
    

class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User        
        fields = ['id', '_id', 'username', 'email', 'isAdmin', 'name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get__id(self, obj):
        return obj.id
    
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

class UserSerializerWithToken(UserSerializer):
     token = serializers.SerializerMethodField(read_only=True)
     class Meta:
        model = User        
        fields = ['id', '_id', 'username', 'email', 'isAdmin', 'name', 'token', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

     def get_token(self, obj):
         token = RefreshToken.for_user(obj)
         return str(token.access_token)
         
        

class RegisterSerializer(serializers.Serializer):
   
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)   

class UserUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(required=False, write_only=True)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'



class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    # These fields don't exist directly on the Order model, 
    # so we tell Django to figure them out using the functions below
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        # Grabs all OrderItems that have a ForeignKey pointing to this specific Order
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            # Grabs the one ShippingAddress pointing to this Order
            # obj.shippingaddress is automatically created by Django's OneToOneField
            address = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        # Grabs the basic user info so React knows whose order this is
        user = obj.user
        return {
            "id": user.id,
            "name": user.first_name or user.username,
            "email": user.email
        }