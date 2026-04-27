from rest_framework import serializers
from .models import Categoria, Producto, LoteInventario
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'password', 'is_superuser', 'is_staff']
        # Esto asegura que la contraseña viaje encriptada y nunca se devuelva al frontend por seguridad
        extra_kwargs = {'password': {'write_only': True, 'required': False}} 

    def create(self, validated_data):
        # Encriptamos la contraseña automáticamente al crear
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['is_staff'] = True # Todos los que se creen por aquí tendrán acceso al sistema
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Si deciden cambiar la contraseña, la encriptamos de nuevo
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class LoteInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoteInventario
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = '__all__'

    # Esta función arma el texto "Padre > Hijo" automáticamente
    def get_categoria_nombre(self, obj):
        if obj.categoria:
            if obj.categoria.categoria_padre:
                return f"{obj.categoria.categoria_padre.nombre} > {obj.categoria.nombre}"
            return obj.categoria.nombre
        return "General"