
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.orm import create_schema
from typing import List
from ..models import MenuItem, PaginaEstatica, Curiosidade, RecursoPedagogico
from ..schema.pages import MenuItemSchema, PaginaEstaticaSchema

router = Router()

@router.get("/menu", response=List[MenuItemSchema], summary="Retorna uma lista de Menu.")
def get_menu(request):
  data = MenuItem.objects.all().order_by('order')
  return data



@router.get("/get/{slug}", response=PaginaEstaticaSchema)
def get_page(request, slug):
  return get_object_or_404(PaginaEstatica, slug=slug)



@router.get("/pedagogia/{id}", response=create_schema(RecursoPedagogico))
def get_pedagogia(request, id):
  return get_object_or_404(RecursoPedagogico, id=id)


@router.get("/curiosidade/{id}", response=create_schema(Curiosidade))
def get_curiosidades(request, id):
  return get_object_or_404(Curiosidade, id=id)

