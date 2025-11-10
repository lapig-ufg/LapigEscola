from django.contrib import admin
from ordered_model.admin import OrderedModelAdmin
from ..models import (
  Bioma, Conteudo,  Tag,
  VideoEducativo,  RecursoPedagogico, PaginaEstatica, MenuItem, Layer,

)

# Registra cada model no site de administração




@admin.register(MenuItem)
class MenuItemAdmin(OrderedModelAdmin):
    list_display = ('label', 'pagina', 'anchor_id', 'move_up_down_links')
    list_filter = ('pagina',)

@admin.register(PaginaEstatica)
class PaginaEstaticaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'slug')
    prepopulated_fields = {'slug': ('titulo',)}



admin.site.register(Bioma)

admin.site.register(Tag)


