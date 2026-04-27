from rest_framework import viewsets
from .models import Producto, Categoria, LoteInventario
from django.contrib.auth.models import User
from .serializers import ProductoSerializer, CategoriaSerializer, LoteInventarioSerializer, UserSerializer
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

# --- ESTA ES LA CLASE NUEVA QUE FALTABA ---
class LoteInventarioViewSet(viewsets.ModelViewSet):
    queryset = LoteInventario.objects.all()
    serializer_class = LoteInventarioSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# --- NUEVA PUERTA DE LOGIN ---
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Authenticate verifica que el usuario y la contraseña coincidan encriptados
    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'email': user.email,
            'is_superuser': user.is_superuser # ¡Este es el dato clave para los permisos!
        })
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)