from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from drf_spectacular.utils import extend_schema, inline_serializer
from datetime import datetime

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer


@extend_schema(
    # We define an inline serializer just for the Swagger input box
    request=inline_serializer(
        name='OrderRequest',
        fields={
            'orderItems': serializers.ListField(
                child=serializers.DictField(), 
                help_text="Array of cart items"
            ),
            'paymentMethod': serializers.CharField(),
            'taxPrice': serializers.DecimalField(max_digits=7, decimal_places=2),
            'shippingPrice': serializers.DecimalField(max_digits=7, decimal_places=2),
            'totalPrice': serializers.DecimalField(max_digits=7, decimal_places=2),
            'shippingAddress': serializers.DictField(help_text="Dictionary containing address, city, postalCode, country"),
        }
    ),
    # We tell Swagger what the successful output will look like
    responses={201: OrderSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data.get('orderItems')

    # 1. EXPLICITLY check if the cart is completely missing or empty
    if orderItems is None or len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        # 2. Use .get() with fallback values to prevent KeyErrors
        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod', ''),
            taxPrice=data.get('taxPrice', 0),
            shippingPrice=data.get('shippingPrice', 0),
            totalPrice=data.get('totalPrice', 0)
        )

        # 3. Create the Shipping Address object securely
        shipping_data = data.get('shippingAddress', {})
        shipping = ShippingAddress.objects.create(
            order=order,
            address=shipping_data.get('address', ''),
            city=shipping_data.get('city', ''),
            postalCode=shipping_data.get('postalCode', ''),
            country=shipping_data.get('country', ''),
            shippingPrice=data.get('shippingPrice', 0) 
        )

        # 4. Loop through the cart and create individual OrderItem objects
        for i in orderItems:
            # FIX: Tell Django to look for 'product' first, but fall back to '_id' if React used that instead
            product_id = i.get('product') or i.get('_id')
            
            try:
                # Grab the specific product from the database safely
                product = Product.objects.get(_id=product_id)
            except Product.DoesNotExist:
                # FIX: This will now print the actual missing ID to your screen so you can debug!
                return Response({'detail': f'Product with ID {product_id} not found'}, status=status.HTTP_400_BAD_REQUEST)

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i.get('qty', 0),
                price=i.get('price', 0),
                image=product.image.url if product.image else ''
            )

            # 5. Deduct the purchased quantity from the product's stock
            product.countInStock -= item.qty
            product.save()

        # 6. Serialize the newly created order and send it back to React
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)

        # SECURITY: Only let the user who created the order (or an admin) view it
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    # 1. Update the order status
    order.isPaid = True
    order.paidAt = datetime.now()
    
    # 2. Save the updated order back to the database
    order.save()

    return Response('Order was successfully paid')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    
    # Grab all orders where the user matches the currently logged-in user
    orders = user.order_set.all()
    
    # We use many=True because we are returning a list of multiple orders, not just one!
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser]) # Only admins can see all orders
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser]) # Only admins can deliver orders
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteOrder(request, pk):
    order = Order.objects.get(_id=pk)
    order.delete()
    return Response('Order was deleted')

