# models/map.py
from django.db import models
from django.utils.text import slugify
from .layer import Layer


class Map(models.Model):
  titulo = models.CharField(max_length=100, verbose_name="Título")
  descricao = models.TextField(verbose_name="Descrição", blank=True)
  slug = models.SlugField(unique=True, blank=True, max_length=150)

  # Camadas do mapa (ManyToMany através de MapLayer)
  layers = models.ManyToManyField(
    Layer,
    through='MapLayer',
    related_name='maps',
    verbose_name="Camadas"
  )

  # Configurações de visualização
  centroide = models.URLField(
    max_length=512,
    verbose_name="URL do Centroide/Feature",
    help_text="URL do GeoJSON para centralizar o mapa",
    blank=True
  )

  center_lon = models.FloatField(
    null=True,
    blank=True,
    verbose_name="Longitude do Centro",
    help_text="Longitude do centro inicial do mapa"
  )

  center_lat = models.FloatField(
    null=True,
    blank=True,
    verbose_name="Latitude do Centro",
    help_text="Latitude do centro inicial do mapa"
  )

  initial_zoom = models.IntegerField(
    default=6,
    verbose_name="Zoom Inicial",
    help_text="Nível de zoom inicial do mapa (1-20)"
  )

  # Metadados
  is_published = models.BooleanField(
    default=True,
    verbose_name="Publicado",
    help_text="Se o mapa está visível publicamente"
  )

  created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
  updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

  class Meta:
    verbose_name = "Mapa"
    verbose_name_plural = "Mapas"
    ordering = ['titulo']

  def __str__(self):
    return self.titulo

  def save(self, *args, **kwargs):
    # Auto-gera slug se não existir
    if not self.slug:
      self.slug = slugify(self.titulo)

      # Garante unicidade do slug
      original_slug = self.slug
      counter = 1
      while Map.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
        self.slug = f"{original_slug}-{counter}"
        counter += 1

    super().save(*args, **kwargs)

  def get_ordered_layers(self):
    """Retorna as camadas ordenadas"""
    return self.layers.filter(is_active=True).order_by('maplayer__order')


class MapLayer(models.Model):
  """Tabela intermediária para ordenar as camadas no mapa"""
  map = models.ForeignKey(Map, on_delete=models.CASCADE)
  layer = models.ForeignKey(Layer, on_delete=models.CASCADE)
  order = models.PositiveIntegerField(default=0, verbose_name="Ordem")
  is_visible = models.BooleanField(
    default=True,
    verbose_name="Visível",
    help_text="Se a camada está visível por padrão"
  )
  opacity = models.FloatField(
    default=1.0,
    verbose_name="Opacidade",
    help_text="Opacidade da camada (0.0 a 1.0)"
  )

  class Meta:
    ordering = ['order']
    unique_together = ('map', 'layer')
    verbose_name = "Camada do Mapa"
    verbose_name_plural = "Camadas do Mapa"

  def __str__(self):
    return f"{self.map.titulo} - {self.layer.title}"
