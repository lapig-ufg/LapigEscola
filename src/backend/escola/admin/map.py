# admin.py
from django.contrib import admin
from ..models import Map, MapLayer
from ordered_model.admin import OrderedModelAdmin
from ..models import Layer

@admin.register(Layer)
class LayerAdmin(OrderedModelAdmin):
  list_display = ['title', 'layer_type', 'is_active', 'order', 'move_up_down_links']
  list_filter = ['layer_type', 'is_active', 'created_at']
  search_fields = ['title', 'description', 'url']  # <-- IMPORTANTE: Adicione isso
  ordering = ['order']
  readonly_fields = ['created_at', 'updated_at']

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
