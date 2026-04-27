from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Creamos el enrutador automático
router = DefaultRouter()

# Registramos nuestras 3 rutas principales
router.register(r'categorias', views.CategoriaViewSet)
router.register(r'productos', views.ProductoViewSet)
router.register(r'lotes', views.LoteInventarioViewSet) # <-- AQUÍ ESTÁ LA MAGIA
router.register(r'usuarios', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.login_view, name='login'), # <-- NUEVA RUTA DE LOGIN
]