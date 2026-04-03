from django.contrib import admin
from .models import Categoria, Producto

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # Esto define las columnas que el cliente verá en su panel
    list_display = ('nombre', 'sku', 'precio', 'categoria')
    search_fields = ('nombre', 'sku')
    list_filter = ('categoria',)

admin.site.register(Categoria)