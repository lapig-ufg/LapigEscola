# api/map.py
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from ninja import Router
from typing import List
from ..models import Map
from ..schema.map import MapSchema, MapEmbedSchema, MapListResponse

router = Router(tags=["Maps"])


@router.get("/list-for-editor", response=List[MapEmbedSchema], summary="Listar mapas para CKEditor")
def list_maps_for_editor(request):
  """
  Lista todos os mapas disponíveis de forma simplificada.
  Usado pelo plugin do CKEditor para mostrar opções de mapas.
  """
  maps = Map.objects.filter(
    is_published=True
  ).annotate(
    layers_count=Count('layers')
  ).order_by('titulo').values(
    'id', 'slug', 'titulo', 'descricao', 'layers_count'
  )

  return list(maps)


@router.get("/id/{map_id}", response=MapSchema, summary="Buscar mapa por ID")
def get_map_by_id(request, map_id: int):
  """
  Retorna dados completos de um mapa pelo ID.
  Alternativa para quando só temos o ID disponível.
  """
  map_obj = get_object_or_404(
    Map.objects.prefetch_related(
      'maplayer_set__layer'
    ).filter(is_published=True),
    id=map_id
  )
  return map_obj


@router.get("/{slug}", response=MapSchema, summary="Buscar mapa por slug")
def get_map_by_slug(request, slug: str):
  """
  Retorna dados completos de um mapa pelo slug.
  Usado pelo componente DynamicMapComponent no Angular.
  """
  map_obj = get_object_or_404(
    Map.objects.prefetch_related(
      'maplayer_set__layer'
    ).filter(is_published=True),
    slug=slug
  )
  return map_obj


@router.get("", response=MapListResponse, summary="Listar todos os mapas")
def list_maps(request, search: str = None, limit: int = 20, offset: int = 0):
  """
  Lista todos os mapas com paginação e busca opcional.

  Parâmetros:
  - search: termo de busca para filtrar por título ou descrição
  - limit: quantidade de resultados por página (padrão: 20)
  - offset: deslocamento para paginação (padrão: 0)
  """
  queryset = Map.objects.filter(is_published=True).annotate(
    layers_count=Count('layers')
  )

  # Aplica filtro de busca se fornecido
  if search:
    queryset = queryset.filter(
      Q(titulo__icontains=search) | Q(descricao__icontains=search)
    )

  # Conta total
  count = queryset.count()

  # Aplica paginação
  results = queryset.order_by('titulo')[offset:offset + limit].values(
    'id', 'slug', 'titulo', 'descricao', 'layers_count'
  )

  return {
    'count': count,
    'results': list(results)
  }
