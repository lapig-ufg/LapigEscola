
from ninja.orm import create_schema
from ninja import Schema, ModelSchema
from typing import Optional, Dict, Any, List, Literal
from ..models import Layer




LayerTypeChoices = Literal['GEOJSON', 'WMS', 'TILE', 'VECTOR', 'WFS']


class LayerSchema(ModelSchema):
  """Schema para uma camada individual"""
  layer_type: LayerTypeChoices
  metadata: Dict[str, Any] = {}
  style: Dict[str, Any] = {}

  class Meta:
    model = Layer
    fields = [
      'id',
      'title',
      'description',
      'url',
      'layer_type',
      'is_active',
      'metadata',
      'style',
      'order'
    ]

class LayersSchema(Schema):
  focusFeatureUrl: str
  layers: List[LayerSchema]

class LayerListSchema(Schema):
  """Schema simplificado para listagem"""
  id: int
  title: str
  layer_type: str
  is_active: bool
  order: int


class LayersCollectionSchema(Schema):
  """Schema para coleção de camadas com configurações do mapa"""
  layers: List[LayerSchema]
  focusFeatureUrl: Optional[str] = None
  center: Optional[List[float]] = None  # [lon, lat]
  zoom: Optional[int] = None

  class Config:
    json_schema_extra = {
      "example": {
        "layers": [
          {
            "id": 1,
            "title": "Solo do Cerrado",
            "url": "https://example.com/geojson/solo-cerrado.json",
            "layer_type": "GEOJSON",
            "is_active": True,
            "order": 0,
            "metadata": {"opacity": 0.8},
            "style": {"color": "#FF5722"}
          }
        ],
        "focusFeatureUrl": "https://example.com/geojson/cerrado-boundary.json",
        "center": [-47.9292, -15.7801],
        "zoom": 6
      }
    }
