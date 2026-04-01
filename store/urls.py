from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', views.home, name='home'),
    path('add-to-cart/<int:id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/', views.cart_page, name='cart'),
    path('remove/<int:id>/', views.remove_item, name='remove'),
    path('checkout/', views.checkout, name='checkout'),
    path('signup/', views.signup, name='signup'),
    path('orders/', views.my_orders, name='orders'),
    path('increase/<int:id>/', views.increase_quantity, name='increase'),
    path('decrease/<int:id>/', views.decrease_quantity, name='decrease'),
    path('success/', views.success, name='success'),
    path('fake-payment/', views.fake_payment, name='fake_payment'),
    path('api/products/', views.product_list),
    path('api/cart/', views.get_cart),
    path('api/add-to-cart/<int:id>/', views.add_to_cart),
    path('api/save-order/', views.save_order),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/refresh/', TokenRefreshView.as_view()),
    path('api/signup/', views.signup),
    path('api/increase/<int:id>/', views.increase_quantity),
    path('api/decrease/<int:id>/', views.decrease_quantity),
    path('api/remove/<int:id>/', views.remove_from_cart),
    path('api/orders/', views.my_orders),
]
