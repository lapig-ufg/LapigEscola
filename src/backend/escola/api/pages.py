
from django.shortcuts import get_object_or_404
from ninja import Router
from typing import List
from ..models import MenuItem, PaginaEstatica
from ..schema.pages import MenuItemSchema, PaginaEstaticaSchema

router = Router()

@router.get("/menu", response=List[MenuItemSchema], summary="Retorna uma lista de Menu.")
def get_menu(request):
  data = MenuItem.objects.all().order_by('order')
  return data



@router.get("/get/{slug}", response=PaginaEstaticaSchema)
def get_page(request, slug):
  return get_object_or_404(PaginaEstatica, slug=slug)
