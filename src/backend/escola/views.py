from django.shortcuts import render

# Create your views here.

from django.views.generic import TemplateView

from django.conf import settings


class NuxtView(TemplateView):
    template_name = "index.html"
    if settings.DEBUG:
       template_name = "dev/index.html"
    def get_context_data(self, **kwargs):
        return {}  # Opcional: passar dados para o template
