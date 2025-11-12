# schema/map.py
from ninja import Schema, ModelSchema
from typing import Optional, List
from ..models import Map
from ..schema.layer import LayerSchema, LayersCollectionSchema


class MapLayerSchema(Schema):
  """Schema para camada dentro de um mapa"""
  layer: LayerSchema
  order: int
  is_visible: bool
  opacity: float


class MapSchema(ModelSchema):
  """Schema completo do mapa com todas as relações"""
  layers_data: LayersCollectionSchema

  class Meta:
    model = Map
    fields = [
      'id',
      'titulo',
      'descricao',
      'slug',
      'centroide',
      'center_lon',
      'center_lat',
      'initial_zoom',
      'is_published'
    ]

  @staticmethod
  def resolve_layers_data(obj):
    """Resolve as camadas do mapa de forma ordenada"""
    map_layers = obj.maplayer_set.select_related('layer').filter(
      layer__is_active=True
    ).order_by('order')

    layers = []
    for ml in map_layers:
      layer_data = LayerSchema.from_orm(ml.layer).dict()
      # Adiciona configurações específicas do MapLayer
      layer_data['is_visible'] = ml.is_visible
      layer_data['opacity'] = ml.opacity
      layers.append(layer_data)

    center = None
    if obj.center_lon is not None and obj.center_lat is not None:
      center = [obj.center_lon, obj.center_lat]

    return {
      'layers': layers,
      'focusFeatureUrl': obj.centroide or None,
      'center': center,
      'zoom': obj.initial_zoom
    }


class MapEmbedSchema(Schema):
  """Schema simplificado para listagem no CKEditor"""
  id: int
  slug: str
  titulo: str
  descricao: Optional[str] = None
  layers_count: int


class MapListResponse(Schema):
  """Response para lista de mapas"""
  count: int
  results: List[MapEmbedSchema]
