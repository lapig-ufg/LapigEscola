from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from .bioma_models import Tema, Bioma # Importante: importe de outros arquivos do pacote
from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage
from ordered_model.models import OrderedModel


class Tag(models.Model):
  # ... (código completo da classe Tag)
  nome = models.CharField(max_length=50, unique=True)

  def __str__(self):
    return self.nome

class Conteudo(models.Model):
    # ... (código completo da classe Conteudo)
    tema = models.OneToOneField(
      Tema,
      on_delete=models.CASCADE,
      null=False,
      blank=False, related_name="conteudo")
    titulo = models.CharField(max_length=200)
    texto = CKEditor5Field()

    def __str__(self):
        return self.titulo

class ImagemGaleria(OrderedModel):
    # ... (código completo da classe ImagemGaleria)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE, related_name="imagens")
    imagem = models.ImageField(
      upload_to=f"{settings.AWS_IMAGES_PATH}galeria/",
      storage=S3Boto3Storage(),
                   )
    titulo = models.CharField(max_length=150)
    resumo = models.CharField(max_length=255, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    order_with_respect_to = 'tema'

    class Meta(OrderedModel.Meta):
      pass
    def __str__(self):
        return self.titulo



class VideoEducativo(models.Model):
    # ... (código completo da classe VideoEducativo)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE, related_name="videos")
    titulo = models.CharField(max_length=200)
    resumo = models.CharField(max_length=255, blank=True)
    embed_url = models.URLField(max_length=512)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.titulo

class Curiosidade(models.Model):
    # ... (código completo da classe Curiosidade)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE, related_name="curiosidades")
    titulo = models.CharField(max_length=200)
    resumo = models.CharField(max_length=255, blank=True)
    texto = CKEditor5Field()
    imagem = models.ImageField(
      upload_to=f"{settings.AWS_IMAGES_PATH}curiosidades/",
      storage=S3Boto3Storage(),
      blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.titulo

class RecursoPedagogico(models.Model):
  # ... (código completo da classe RecursoPedagogico)
  TIPO_CHOICES = [
    ('ATIVIDADE', 'Atividade'),
    ('RECURSO', 'Recurso Didático'),
  ]
  tema = models.ForeignKey(Tema, on_delete=models.CASCADE, related_name="recursos_pedagogicos")
  tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
  titulo = models.CharField(max_length=200)
  resumo = models.CharField(max_length=255, blank=True)
  texto = CKEditor5Field()
  imagem = models.ImageField(
    upload_to=f"{settings.AWS_IMAGES_PATH}recurso-pedagogico/",
    storage=S3Boto3Storage(),
    blank=True, null=True)
  file = models.FileField(
    upload_to=f"{settings.AWS_LOCATION}recurso-pedagogico/",
    storage=S3Boto3Storage(),
    blank=True, null=True
  )
  link_externo = models.URLField(max_length=512, blank=True, null=True)

  class Meta:
    verbose_name = "Recurso Pedagógico"
    verbose_name_plural = "Recursos Pedagógicos"

  def __str__(self):
    return self.titulo
