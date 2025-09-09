from typing import List
from ninja import Schema
from ninja.orm import create_schema
from ..models import Layer


LayerSchema = create_schema(Layer)

class LayersSchema(Schema):
  focusFeatureUrl: str
  layers: List[LayerSchema]
