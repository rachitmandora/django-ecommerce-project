from django.shortcuts import render, get_object_or_404
from .models import Product
from django.contrib.auth.decorators import login_required

def home(request):
    products = Product.objects.all()
    categories = Category.objects.all()

    recommended_products = []

    if request.user.is_authenticated:
        user_orders = Order.objects.filter(user=request.user)

        # Get categories user bought
        category_ids = []
        for order in user_orders:
            category_ids.append(order.product.category.id)

        # Get similar products
        recommended_products = Product.objects.filter(category__id__in=category_ids).exclude(id__in=[o.product.id for o in user_orders]).distinct()

    return render(request, 'index.html', {
        'products': products,
        'categories': categories,
        'recommended_products': recommended_products
    })

def product_detail(request, id):
    product = get_object_or_404(Product, id=id)
    return render(request,'product_detail.html',{'product':product})

from .models import Product,Cart,Order,Category
from django.shortcuts import redirect


@login_required
def add_to_cart(request, id):
    product = Product.objects.get(id=id)

    cart_item, created = Cart.objects.get_or_create(
        user=request.user,
        product=product
    )

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return redirect('home')

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

from django.contrib.auth.decorators import login_required

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

from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

def signup(request):
    form = UserCreationForm()

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')

    return render(request, 'signup.html', {'form': form})

@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'orders.html', {'orders': orders})

from django.shortcuts import get_object_or_404

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