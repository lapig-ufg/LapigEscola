from ninja import Schema
from typing import Optional, List
from ..models import PaginaEstatica


class TemaSchema(Schema):
  nome: str
  slug: str
  order: int



class BiomaSchema(Schema):
  nome: str
  slug: str
  temas: List[TemaSchema]
