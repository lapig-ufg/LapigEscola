from django.db import models
from ordered_model.models import OrderedModel

from ..models import Tema

class Layer(OrderedModel):
  LAYER_TYPE_CHOICES = [
    ('GEOJSON', 'GeoJSON'),
    ('WMS', 'WMS (Web Map Service)'),
    ('TILE', 'Tile Layer (XYZ/Raster)'),
    ('VECTOR', 'Vector Tiles'),
    ('WFS', 'WFS (Web Feature Service)'),
  ]

  temas = models.ManyToManyField(Tema, related_name="layers", through='LayerTemaOrder')
  title = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  url = models.URLField(max_length=512)
  layer_type = models.CharField(  # Substitui o ForeignKey por CharField
    max_length=20,
    choices=LAYER_TYPE_CHOICES,
    default='GEOJSON',
    verbose_name="Tipo de Camada"
  )

  is_active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  metadata = models.JSONField(default=dict, blank=True)


  style = models.JSONField(default=dict, blank=True)

  def __str__(self):
    return f"{self.title} ({self.get_layer_type_display()})"



class LayerTemaOrder(OrderedModel):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE)
    order_with_respect_to = 'tema'

    class Meta(OrderedModel.Meta):
      ordering = ('tema', 'order')
      unique_together = ('tema', 'layer')
