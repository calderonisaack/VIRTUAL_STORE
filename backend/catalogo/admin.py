from django.contrib import admin
from .models import Categoria, Producto, LoteInventario

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # Cambiamos 'precio' por 'precio_venta' y mostramos más datos útiles
    list_display = ('nombre', 'sku', 'precio_venta', 'categoria', 'permite_al_por_mayor')
    search_fields = ('nombre', 'sku')
    list_filter = ('categoria', 'permite_al_por_mayor')

@admin.register(LoteInventario)
class LoteInventarioAdmin(admin.ModelAdmin):
    # Esto le permitirá al cliente ver cuántos días lleva el lote guardado
    list_display = ('producto', 'fecha_ingreso', 'cantidad_ingresada', 'cantidad_disponible', 'dias_en_stock')
    list_filter = ('fecha_ingreso', 'producto')

admin.site.register(Categoria)