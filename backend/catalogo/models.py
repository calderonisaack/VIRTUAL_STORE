import uuid
from datetime import date
from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    # NUEVO: Subcategorías (Se relaciona consigo misma)
    categoria_padre = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategorias')

    def __str__(self):
        # Para que en el panel se vea "Celulares -> Samsung"
        if self.categoria_padre:
            return f"{self.categoria_padre.nombre} -> {self.nombre}"
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    caracteristicas = models.TextField() 
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    
    # NUEVO: Precios de compra (unitario) y venta
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2, help_text="Costo unitario del producto")
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, help_text="Precio al público")
    
    # NUEVO: Ventas al por mayor
    permite_al_por_mayor = models.BooleanField(default=False)
    precio_mayorista = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cantidad_minima_mayorista = models.PositiveIntegerField(default=6, help_text="Cantidad para aplicar precio mayorista")
    
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    sku = models.CharField(max_length=12, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = str(uuid.uuid4().hex[:8].upper())
        super(Producto, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} - {self.sku}"

# NUEVA TABLA: Para manejar el stock, las fechas y los días sin vender
class LoteInventario(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='lotes')
    cantidad_ingresada = models.PositiveIntegerField(help_text="Cantidad original que entró")
    cantidad_disponible = models.PositiveIntegerField(help_text="Cantidad que sobra para vender")
    
    # Se llena automáticamente con la fecha en que se registra
    fecha_ingreso = models.DateField(auto_now_add=True) 

    # Esto calcula los días en stock automáticamente sin guardarlo en la base de datos
    @property
    def dias_en_stock(self):
        return (date.today() - self.fecha_ingreso).days

    def __str__(self):
        return f"{self.producto.nombre} - Ingreso: {self.fecha_ingreso} ({self.cantidad_disponible} disponibles)"