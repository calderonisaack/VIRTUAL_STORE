from rest_framework import serializers
from .models import Categoria, Producto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    # Esto permite que al pedir un producto, también traiga los datos de la categoría
    categoria_detalle = CategoriaSerializer(source='categoria', read_only=True)

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'caracteristicas', 'precio', 'categoria', 'categoria_detalle', 'sku', 'imagen']