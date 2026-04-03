import uuid
from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    caracteristicas = models.TextField() # Aquí van los detalles de tecnología o tallas de ropa
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    
    # El SKU (Purchase Order Guide) que se genera solo
    sku = models.CharField(max_length=12, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.sku:
            # Genera un código aleatorio único de 8 caracteres (ej. 4F8A9B2C)
            self.sku = str(uuid.uuid4().hex[:8].upper())
        super(Producto, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} - {self.sku}"