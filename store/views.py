from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Product, Category, Cart
from .models import Product,Cart,Order,Category
from django.shortcuts import redirect
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.contrib import messages
from .models import Cart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from django.views.decorators.csrf import csrf_exempt
from .models import Order
from .models import Order, Product, Cart
from rest_framework.permissions import AllowAny


def home(request):
    products = Product.objects.all()
    categories = Category.objects.all()

    recommended_products = []
    cart_count = 0

    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user)

        # ✅ Cart count
        cart_count = sum(item.quantity for item in cart_items)

        # ✅ Get category ids from cart
        category_ids = list(set(
            item.product.category.id for item in cart_items
        ))

        if category_ids:
            # ✅ Recommend similar category products
            recommended_products = Product.objects.filter(
                category__id__in=category_ids
            ).exclude(
                id__in=[item.product.id for item in cart_items]
            )[:4]
        else:
            # ✅ If cart empty → show random products
            recommended_products = Product.objects.order_by('?')[:4]

    else:
        # ✅ If user not logged in → show random products
        recommended_products = Product.objects.order_by('?')[:4]

    return render(request, 'index.html', {
        'products': products,
        'categories': categories,
        'recommended_products': recommended_products,
        'cart_count': cart_count
    })

def product_detail(request, id):
    product = get_object_or_404(Product, id=id)
    return render(request,'product_detail.html',{'product':product})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, id):
    user = request.user   # ✅ IMPORTANT

    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    cart_item, created = Cart.objects.get_or_create(
        user=user,
        product=product
    )

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return Response({"message": "Added to cart"})

@login_required
def cart_page(request):
    cart_items = Cart.objects.filter(user=request.user)

    total = 0
    for item in cart_items:
        total += item.product.price * item.quantity

    return render(request, 'cart.html', {
        'cart_items': cart_items,
        'total': total
    })

def remove_item(request,id):
    item = Cart.objects.get(id=id)
    item.delete()
    return redirect('cart')

@login_required
def checkout(request):
    cart_items = Cart.objects.filter(user=request.user)

    if request.method == "POST":

        for item in cart_items:
            Order.objects.create(
                user=request.user,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart_items.delete()

        return redirect('success')

    return render(request, 'checkout.html')


def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "User already exists"})

        User.objects.create_user(
            username=username,
            password=password
        )

        return JsonResponse({"message": "Signup successful"})
    
@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'orders.html', {'orders': orders})


@login_required
def increase_quantity(request, id):
    cart_item = get_object_or_404(Cart, id=id, user=request.user)
    cart_item.quantity += 1
    cart_item.save()
    return redirect('cart')


@login_required
def decrease_quantity(request, id):
    cart_item = get_object_or_404(Cart, id=id, user=request.user)

    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    else:
        cart_item.delete()

    return redirect('cart')

def success(request):
    return render(request, 'success.html')


def fake_payment(request):
    if request.user.is_authenticated:
        # clear cart after payment
        Cart.objects.filter(user=request.user).delete()

        messages.success(request, "✅ Payment Successful!")

    return redirect('home')


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    products = Product.objects.all()

    data = []
    for product in products:
        image_url = None
        if product.image:
            image_url = request.build_absolute_uri(product.image.url)

        data.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "category": product.category.name,
            "image": image_url   # ✅ ADDED
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)

    data = []
    for item in cart_items:
        data.append({
            "id": item.product.id,
            "name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity
        })

    return JsonResponse(data, safe=False)  


@csrf_exempt
def save_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cart = data.get("cart")

        user = User.objects.first()

        for item in cart:
            product = Product.objects.get(id=item["id"])

            Order.objects.create(
                user=user,
                product=product,
                quantity=item["quantity"],
                price=item["price"]
            )

        # ✅ Clear cart after order
        Cart.objects.filter(user=user).delete()

        return JsonResponse({"message": "Order saved"})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def increase_quantity(request, id):
    user = request.user
    cart_item = Cart.objects.get(user=user, product__id=id)
    cart_item.quantity += 1
    cart_item.save()
    return Response({"message": "Quantity increased"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decrease_quantity(request, id):
    user = request.user
    cart_item = Cart.objects.get(user=user, product__id=id)

    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    else:
        cart_item.delete()

    return Response({"message": "Quantity decreased"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, id):
    user = request.user
    Cart.objects.filter(user=user, product__id=id).delete()
    return Response({"message": "Item removed"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user)

    data = []
    for order in orders:
        data.append({
            "id": order.id,
            "product": order.product.name,
            "price": order.price,
            "quantity": order.quantity,
        })

    return Response(data)
