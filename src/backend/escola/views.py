from django.shortcuts import render

# Create your views here.

from django.views.generic import TemplateView

class NuxtView(TemplateView):
    template_name = "index.html"  # Arquivo gerado pelo Nuxt
    def get_context_data(self, **kwargs):
        return {}  # Opcional: passar dados para o template
