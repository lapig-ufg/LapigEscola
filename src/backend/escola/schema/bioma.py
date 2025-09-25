from ninja import Schema
from typing import Optional, List
from ..models import PaginaEstatica, ImagemGaleria, Curiosidade
from ninja.orm import create_schema
from django.db import models

class TemaSchema(Schema):
  nome: str
  slug: str
  order: int



class BiomaSchema(Schema):
  nome: str
  slug: str
  temas: List[TemaSchema]



SchemaImagemGaleria = create_schema(ImagemGaleria)


class SchemaCuriosidade(Schema):
  titulo: str
  resumo: str
  imagem: str | None = None
  id: int


class SchemaPedagogia(Schema):
  titulo: str
  resumo: str
  imagem: str | None = None
  file: str | None = None
  id: int
