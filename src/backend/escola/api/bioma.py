from django.db.models.query import Prefetch
from django.shortcuts import get_object_or_404
from ninja import Router

from typing import List

from ..models import Bioma, Tema, Conteudo, Layer, ImagemGaleria, Curiosidade, RecursoPedagogico
from ..schema.bioma import BiomaSchema, SchemaImagemGaleria, SchemaCuriosidade, SchemaPedagogia
from ..schema.layer import LayersSchema
from ninja.orm import create_schema


ConteudoSchema = create_schema(Conteudo)
InfoBiomaSchema = create_schema(Bioma)


router = Router()



@router.get("/list", response=List[BiomaSchema])
def list_biomas(request):
  biomas = Bioma.objects.all().prefetch_related(
    Prefetch('temas', queryset=Tema.objects.order_by('bioma', 'order'))
  )

  result = []
  for bioma in biomas:
    bioma_data = {
      "id": bioma.id,
      "nome": bioma.get_nome_display(),
      "slug": bioma.slug,
      "temas": [
        {
          "nome": tema.nome,
          "slug": tema.slug,
          "order": tema.order  # Campo de ordenação
        } for tema in bioma.temas.all()
      ]
    }
    result.append(bioma_data)

  return result

@router.get('/{bioma_slug}/info', response=InfoBiomaSchema)
def get_info_bioma(request, bioma_slug):
  return get_object_or_404(Bioma, slug=bioma_slug)

@router.get('/{bioma_slug}/tema/{tema_slug}/conteudo', response=ConteudoSchema)
def conteudo(request, bioma_slug, tema_slug):
  # Verifica se o bioma existe
  bioma = get_object_or_404(Bioma, slug=bioma_slug)

  # Obtém o tema específico do bioma
  tema = get_object_or_404(Tema, slug=tema_slug, bioma=bioma)

  # Obtém o conteúdo relacionado ao tema
  return get_object_or_404(Conteudo, tema=tema)



@router.get('/{bioma_slug}/tema/{tema_slug}/layers', response=LayersSchema)
def get_layers(request, bioma_slug, tema_slug):
  # Verifica se o bioma existe
  bioma = get_object_or_404(Bioma, slug=bioma_slug)

  # Obtém o tema específico do bioma
  tema = get_object_or_404(Tema, slug=tema_slug, bioma=bioma)
  layers = Layer.objects.filter(temas=tema)
  # Obtém o conteúdo relacionado ao tema
  return LayersSchema(
    focusFeatureUrl=bioma.geourl,
    layers=layers
  )


@router.get('/{bioma_slug}/tema/{tema_slug}/image', response=List[SchemaImagemGaleria])
def get_layers(request, bioma_slug, tema_slug):
  # Verifica se o bioma existe
  bioma = get_object_or_404(Bioma, slug=bioma_slug)

  # Obtém o tema específico do bioma
  tema = get_object_or_404(Tema, slug=tema_slug, bioma=bioma)
  images = ImagemGaleria.objects.filter(tema=tema)
  # Obtém o conteúdo relacionado ao tema
  return images


@router.get('/{bioma_slug}/tema/{tema_slug}/curiosidades', response=List[SchemaCuriosidade])
def get_curiosidades(request, bioma_slug, tema_slug):
  # Verifica se o bioma existe
  bioma = get_object_or_404(Bioma, slug=bioma_slug)

  # Obtém o tema específico do bioma
  tema = get_object_or_404(Tema, slug=tema_slug, bioma=bioma)
  curiosidade = Curiosidade.objects.filter(tema=tema)
  # Obtém o conteúdo relacionado ao tema
  return curiosidade



@router.get('/{bioma_slug}/tema/{tema_slug}/pedagogias', response=List[SchemaPedagogia])
def get_pedagogias(request, bioma_slug, tema_slug):
  # Verifica se o bioma existe
  bioma = get_object_or_404(Bioma, slug=bioma_slug)

  # Obtém o tema específico do bioma
  tema = get_object_or_404(Tema, slug=tema_slug, bioma=bioma)
  # Obtém o conteúdo relacionado ao tema
  return RecursoPedagogico.objects.filter(tema=tema)
