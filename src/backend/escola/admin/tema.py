from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from ordered_model.admin import OrderedModelAdmin, OrderedTabularInline
from ..models import (
  Bioma, Tema, Conteudo, ImagemGaleria, Tag, VideoEducativo,
  Curiosidade, RecursoPedagogico, PaginaEstatica, MenuItem, Layer, LayerTemaOrder
)


from django_ckeditor_5.widgets import CKEditor5Widget
from django.db import models



class HiddenModelAdminMixin:
  def get_model_perms(self, request):
    """
    Retorna permissões vazias para ocultar do menu
    """
    return {}
# Inlines existentes (mantidos conforme seu código original)
class ImagemGaleriaInline(OrderedTabularInline):
  model = ImagemGaleria
  extra = 1
  fields = ('imagem_preview', 'imagem', 'titulo', 'resumo', 'order')
  readonly_fields = ('imagem_preview', 'order')
  ordering = ('order',)

  def imagem_preview(self, obj):
    if obj.imagem:
      return format_html('<img src="{}" width="100" />', obj.imagem.url)
    return "-"
  imagem_preview.short_description = "Preview"

# CÓDIGO CORRIGIDO PARA O admin.py
class LayerTemaOrderInline(OrderedTabularInline):
  model = LayerTemaOrder

  # Apenas o campo que o usuário realmente edita no inline: 'layer'
  fields = ('layer',)

  # Campos gerados automaticamente ou que são apenas para leitura
  readonly_fields = ('order', 'move_up_down_links',)

  extra = 1
  ordering = ('order',)



# Admin de Conteudo ajustado
@admin.register(Conteudo)
class ConteudoAdmin(HiddenModelAdminMixin, admin.ModelAdmin):
  list_display = ('titulo', 'tema_link')
  search_fields = ('titulo', 'texto')
  formfield_overrides = {
    models.TextField: {'widget': CKEditor5Widget}
  }

  def get_form(self, request, obj=None, **kwargs):
    form = super().get_form(request, obj, **kwargs)

    # Se estiver criando a partir de um tema específico
    if 'tema' in request.GET:
      tema_id = request.GET['tema']
      form.base_fields['tema'].initial = tema_id
      form.base_fields['tema'].disabled = True  # Desabilita a edição do campo

      # Opcional: Pode também tornar o campo hidden se preferir
      # form.base_fields['tema'].widget = forms.HiddenInput()

    return form

  def tema_link(self, obj):
    if obj.tema:
      url = reverse('admin:escola_tema_change', args=[obj.tema.id])
      return format_html('<a href="{}">{}</a>', url, obj.tema)
    return "-"
  tema_link.short_description = "Tema"

  def get_readonly_fields(self, request, obj=None):
    if obj:  # Se estiver editando um objeto existente
      return ['tema']  # Torna o tema somente leitura na edição
    return []

  # Admin de Curiosidade
@admin.register(Curiosidade)
class CuriosidadeAdmin(HiddenModelAdminMixin, admin.ModelAdmin):
  list_display = ('titulo', 'tema_link', 'imagem_preview')
  list_filter = ('tema',)
  search_fields = ('titulo', 'texto')

  def get_form(self, request, obj=None, **kwargs):
    form = super().get_form(request, obj, **kwargs)

    # Se estiver criando a partir de um tema específico
    if 'tema' in request.GET:
      tema_id = request.GET['tema']
      form.base_fields['tema'].initial = tema_id
      form.base_fields['tema'].disabled = True

    return form

  def get_readonly_fields(self, request, obj=None):
    if obj:  # Se estiver editando um objeto existente
      return ['tema']  # Torna o tema somente leitura na edição
    return []

  def tema_link(self, obj):
    if obj.tema:
      url = reverse('admin:escola_tema_change', args=[obj.tema.id])
      return format_html('<a href="{}">{}</a>', url, obj.tema)
    return "-"
  tema_link.short_description = "Tema"

  def imagem_preview(self, obj):
    if obj.imagem:
      return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.imagem.url)
    return "-"
  imagem_preview.short_description = "Preview"


# Admin de RecursoPedagogico
@admin.register(RecursoPedagogico)
class RecursoPedagogicoAdmin(HiddenModelAdminMixin, admin.ModelAdmin):
  list_display = ('titulo', 'tipo', 'tema_link', 'link_externo_short')
  list_filter = ('tema', 'tipo')
  search_fields = ('titulo', 'resumo')
  list_editable = ('tipo',)

  formfield_overrides = {
    models.TextField: {'widget': CKEditor5Widget}
  }

  def get_form(self, request, obj=None, **kwargs):
    form = super().get_form(request, obj, **kwargs)

    # Se estiver criando a partir de um tema específico
    if 'tema' in request.GET:
      tema_id = request.GET['tema']
      form.base_fields['tema'].initial = tema_id
      form.base_fields['tema'].disabled = True

      # Adiciona mensagem explicativa
      form.base_fields['tema'].help_text = "O tema está vinculado automaticamente e não pode ser alterado"

    return form

  def get_readonly_fields(self, request, obj=None):
    if obj:  # Se estiver editando um objeto existente
      return ['tema']  # Torna o tema somente leitura na edição
    return []

  def tema_link(self, obj):
    if obj.tema:
      url = reverse('admin:escola_tema_change', args=[obj.tema.id])
      return format_html('<a href="{}">{}</a>', url, obj.tema)
    return "-"
  tema_link.short_description = "Tema"

  def link_externo_short(self, obj):
    if obj.link_externo:
      return format_html('<a href="{}" target="_blank">🔗 Acessar</a>', obj.link_externo)
    return "-"
  link_externo_short.short_description = "Link"

  def save_model(self, request, obj, form, change):
    # Garante que o tema não seja alterado mesmo se alguém tentar burlar via POST
    if 'tema' in request.GET and not change:
      tema_id = request.GET['tema']
      obj.tema_id = tema_id
    super().save_model(request, obj, form, change)

# Admin de Tema modificado
@admin.register(Tema)
class TemaAdmin(OrderedModelAdmin):
  list_display = ('nome', 'bioma', 'move_up_down_links',
                  'conteudo_link', 'curiosidades_link', 'recursos_link')
  list_filter = ('bioma',)
  ordering = ('bioma', 'order')
  inlines = [ImagemGaleriaInline, LayerTemaOrderInline]

  # Links para a lista de registros
  def conteudo_link(self, obj):
    if hasattr(obj, 'conteudo'):
      url = reverse('admin:escola_conteudo_change', args=[obj.conteudo.id])
      return format_html(
        '<a href="{}" style="padding: 3px 10px; background: #417690; color: white; border-radius: 3px; text-decoration: none;">Editar Conteúdo</a>',
        url
      )
    else:
      url = reverse('admin:escola_conteudo_add') + f'?tema={obj.id}'
      return format_html(
        '<a href="{}" style="padding: 3px 10px; background: #5f9e6e; color: white; border-radius: 3px; text-decoration: none;">Criar Conteúdo</a>',
        url
      )
  conteudo_link.short_description = "Conteúdo"

  def curiosidades_link(self, obj):
    url = reverse('admin:escola_curiosidade_changelist') + f'?tema__id__exact={obj.id}'
    add_url = reverse('admin:escola_curiosidade_add') + f'?tema={obj.id}'
    count = obj.curiosidades.count()

    return format_html(
      '<a href="{}" style="{}">Ver ({})</a> | '
      '<a href="{}" style="{}">+ Nova</a>',
      url,
      "padding: 2px 5px; background: #417690; color: white; margin-right: 3px;",
      count,
      add_url,
      "padding: 2px 5px; background: #5f9e6e; color: white;"
    )
  curiosidades_link.short_description = "Curiosidades"

  def recursos_link(self, obj):
    url = reverse('admin:escola_recursopedagogico_changelist') + f'?tema__id__exact={obj.id}'
    add_url = reverse('admin:escola_recursopedagogico_add') + f'?tema={obj.id}'
    count = obj.recursos_pedagogicos.count()

    return format_html(
      '<div style="margin-top:5px">'
      '<a href="{}" style="{}">Ver ({})</a>'
      '<a href="{}" style="{}">+ Novo</a>'
      '</div>',
      url,
      "padding: 3px 7px; background: #417690; color: white; margin-right: 5px; border-radius: 3px; text-decoration: none;",
      count,
      add_url,
      "padding: 3px 7px; background: #5f9e6e; color: white; border-radius: 3px; text-decoration: none;"
    )
  recursos_link.short_description = "Recursos Pedagógicos"

  readonly_fields = ('conteudo_section', 'curiosidades_section', 'recursos_section')
  fieldsets = (
    (None, {'fields': ('nome', 'bioma')}),
    ('Conteúdo', {'fields': ('conteudo_section',)}),
    ('Curiosidades', {'fields': ('curiosidades_section',)}),
    ('Recursos Pedagógicos', {'fields': ('recursos_section',)}),
  )

  def conteudo_section(self, obj):
    return self.conteudo_link(obj)
  conteudo_section.short_description = "Conteúdo Principal"

  def curiosidades_section(self, obj):
    return self.curiosidades_link(obj)
  curiosidades_section.short_description = "Lista de Curiosidades"

  def recursos_section(self, obj):
    return self.recursos_link(obj)
  recursos_section.short_description = "Lista de Recursos"
