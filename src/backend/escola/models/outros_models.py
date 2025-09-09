from django.db import models
from django.utils.text import slugify
from .bioma_models import Tema # Importe o model Bioma
from django_ckeditor_5.fields import CKEditor5Field
from ordered_model.models import OrderedModel  # Biblioteca para ordenação
from django.urls import reverse

class MenuItem(OrderedModel):
    label = models.CharField('Rótulo', max_length=100)
    pagina = models.ForeignKey(
        'PaginaEstatica',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        help_text="Página estática associada"
    )
    anchor_id = models.CharField(
        'ID de Âncora',
        max_length=50,
        blank=True,
        help_text="ID da seção na página (ex: #visao-geral)"
    )

    class Meta(OrderedModel.Meta):
        verbose_name = 'Item de Menu'
        verbose_name_plural = 'Itens de Menu'

    def __str__(self):
        return self.label








class PaginaEstatica(models.Model):
  titulo = models.CharField(max_length=100)
  slug = models.SlugField(unique=True, blank=True)
  resumo = models.CharField(max_length=160, blank=True)
  conteudo = CKEditor5Field()

  def save(self, *args, **kwargs):
    if not self.slug:
      self.slug = slugify(self.titulo)
    super().save(*args, **kwargs)

  def get_absolute_url(self):
    return reverse('pagina-detail', kwargs={'slug': self.slug})

  def __str__(self):
    return self.titulo

