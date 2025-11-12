# admin.py
from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponseRedirect
from ..models import Map, MapLayer
from ordered_model.admin import OrderedModelAdmin
from ..models import Layer
import requests
import xml.etree.ElementTree as ET

@admin.register(Layer)
class LayerAdmin(OrderedModelAdmin):
  list_display = ['title', 'layer_type', 'is_active', 'order', 'move_up_down_links']
  list_filter = ['layer_type', 'is_active', 'created_at']
  search_fields = ['title', 'description', 'url']  # <-- IMPORTANTE: Adicione isso
  ordering = ['order']
  readonly_fields = ['created_at', 'updated_at']
  change_list_template = "admin/layer_changelist.html"

  fieldsets = (
    ('Informações Básicas', {
      'fields': ('title', 'description', 'layer_type', 'is_active')
    }),
    ('Configuração', {
      'fields': ('url', 'metadata', 'style')
    }),
    ('Metadados', {
      'fields': ('created_at', 'updated_at'),
      'classes': ('collapse',)
    })
  )

  def get_urls(self):
    urls = super().get_urls()
    custom_urls = [
      path('atualizar-wms/', self.admin_site.admin_view(self.atualizar_camadas_wms), name='layer_atualizar_wms'),
    ]
    return custom_urls + urls

  def atualizar_camadas_wms(self, request):
    """Busca e atualiza as camadas do servidor WMS (com tratamento de campos vazios)."""
    wms_url = "https://gs.lapig.iesa.ufg.br/geoserver/amazonia/wms"
    self.message_user(request, f"Iniciando atualização das camadas WMS em {wms_url}", messages.INFO)

    try:
      response = requests.get(wms_url, params={
        'service': 'WMS',
        'version': '1.3.0',
        'request': 'GetCapabilities'
      }, timeout=30)
      response.raise_for_status()
    except Exception as e:
      self.message_user(request, f"Erro ao conectar ao servidor WMS: {e}", messages.ERROR)
      return HttpResponseRedirect("../")

    try:
      root = ET.fromstring(response.content)

      # Detecta namespace automaticamente
      if root.tag.startswith("{"):
        ns_uri = root.tag.split("}")[0].strip("{")
        namespaces = {"wms": ns_uri}
        layer_path = ".//wms:Layer"
        name_path = "wms:Name"
        title_path = "wms:Title"
        abstract_path = "wms:Abstract"
      else:
        namespaces = {}
        layer_path = ".//Layer"
        name_path = "Name"
        title_path = "Title"
        abstract_path = "Abstract"

      layers_encontradas = 0
      layers_criadas = 0
      layers_atualizadas = 0
      camadas_invalidas = 0

      for layer_elem in root.findall(layer_path, namespaces):
        name_elem = layer_elem.find(name_path, namespaces)
        title_elem = layer_elem.find(title_path, namespaces)
        abstract_elem = layer_elem.find(abstract_path, namespaces)

        # Se não tiver nome, pula (camada raiz ou inválida)
        if name_elem is None or not (name_elem.text and name_elem.text.strip()):
          camadas_invalidas += 1
          continue

        layer_name = (name_elem.text or "").strip()
        layer_title = (title_elem.text or layer_name).strip()
        layer_description = (abstract_elem.text or "").strip()

        layers_encontradas += 1

        layer_url = f"{wms_url}?service=WMS&version=1.3.0&request=GetMap&layers={layer_name}"
        metadata = {
          'layer_name': layer_name,
          'wms_url': wms_url,
          'source': 'GeoServer Amazônia LAPIG'
        }

        existing = Layer.objects.filter(metadata__layer_name=layer_name).first()
        if existing:
          existing.title = layer_title
          existing.description = layer_description
          existing.url = layer_url
          existing.layer_type = 'WMS'
          existing.metadata = metadata
          existing.is_active = True
          existing.save()
          layers_atualizadas += 1
        else:
          Layer.objects.create(
            title=layer_title,
            description=layer_description,
            url=layer_url,
            layer_type='WMS',
            metadata=metadata,
            is_active=True
          )
          layers_criadas += 1

      msg = (
        f"✅ {layers_encontradas} camadas processadas: "
        f"{layers_criadas} criadas, {layers_atualizadas} atualizadas. "
        f"{camadas_invalidas} ignoradas (sem nome válido)."
      )
      self.message_user(request, msg, messages.SUCCESS)

    except ET.ParseError as e:
      self.message_user(request, f"Erro ao processar XML: {e}", messages.ERROR)
    except Exception as e:
      self.message_user(request, f"Erro inesperado: {e}", messages.ERROR)

    return HttpResponseRedirect("../")

class MapLayerInline(admin.TabularInline):
  model = MapLayer
  extra = 1
  fields = ('layer', 'order', 'is_visible', 'opacity')
  ordering = ('order',)
  autocomplete_fields = ['layer']


@admin.register(Map)
class MapAdmin(admin.ModelAdmin):
  list_display = ['titulo', 'slug', 'is_published', 'layers_count', 'created_at']
  list_filter = ['is_published', 'created_at']
  search_fields = ['titulo', 'descricao', 'slug']
  prepopulated_fields = {'slug': ('titulo',)}
  readonly_fields = ['created_at', 'updated_at']
  inlines = [MapLayerInline]

  fieldsets = (
    ('Informações Básicas', {
      'fields': ('titulo', 'slug', 'descricao', 'is_published')
    }),
    ('Configurações de Visualização', {
      'fields': (
        'centroide',
        ('center_lon', 'center_lat'),
        'initial_zoom'
      ),
      'description': 'Configure a visualização inicial do mapa'
    }),
    ('Metadados', {
      'fields': ('created_at', 'updated_at'),
      'classes': ('collapse',)
    })
  )

  def layers_count(self, obj):
    return obj.layers.count()

  layers_count.short_description = 'Nº de Camadas'


@admin.register(MapLayer)
class MapLayerAdmin(admin.ModelAdmin):
  list_display = ['map', 'layer', 'order', 'is_visible', 'opacity']
  list_filter = ['is_visible', 'map']
  search_fields = ['map__titulo', 'layer__title']
  ordering = ['map', 'order']
  autocomplete_fields = ['map', 'layer']
