from ninja import Schema
from typing import Optional
from ..models import PaginaEstatica
from ninja.orm import create_schema

PaginaEstaticaSchema = create_schema(PaginaEstatica)

class MenuItemSchema(Schema):
  label: str
  slug: Optional[str] = None  # Schema da página relacionada
  anchor_id: str
  order: int  # Campo do ordered_model

  @staticmethod
  def resolve_slug(obj):
    return obj.pagina.slug if obj.pagina else None

