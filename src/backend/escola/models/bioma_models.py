from django.db import models
from django.utils.text import slugify
from ordered_model.models import OrderedModel


class Bioma(models.Model):
    # ... (código completo da classe Bioma)
    NOME_CHOICES = [
        ('AMAZONIA', 'Amazônia'),
        ('CAATINGA', 'Caatinga'),
        ('CERRADO', 'Cerrado'),
        ('MATA_ATLANTICA', 'Mata Atlântica'),
        ('PANTANAL', 'Pantanal'),
        ('PAMPA', 'Pampa'),
    ]
    nome = models.CharField(max_length=100, choices=NOME_CHOICES, unique=True, verbose_name="Nome do Bioma")
    icon= models.CharField(
      max_length=100, blank=True,  # Allows empty in forms
      default='',  # Empty default
      help_text="Icon file name")
    label = models.CharField(max_length=100, blank=True, help_text="Label Menu")
    slug = models.SlugField(unique=True, blank=True, help_text="Gerado automaticamente a partir do nome")
    geourl = models.URLField(max_length=512,help_text="URL para geosjon")

    class Meta:
        verbose_name = "Bioma"
        verbose_name_plural = "Biomas"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.get_nome_display())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_nome_display()

class Tema(OrderedModel):
    # ... (código completo da classe Tema)
    bioma = models.ForeignKey(Bioma, on_delete=models.CASCADE, related_name="temas")
    nome = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, help_text="Gerado automaticamente a partir do nome")
    order_with_respect_to = 'bioma'

    class Meta(OrderedModel.Meta):
        verbose_name = "Tema do Bioma"
        verbose_name_plural = "Temas dos Biomas"
        unique_together = ('bioma', 'nome')

    def __str__(self):
      return f"{self.bioma.nome} - {self.nome}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)


