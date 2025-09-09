<!-- pages/biomas/[bioma].vue -->
<template>
  <div>
    <h1 class="page-title">{{ biomaAtual.label }}</h1>

    <div class="content-section">
      <BiomaContent :title="`Localização do ${biomaAtual.label}`">
        <template #texto>
          <h3>Geologia do {{ biomaAtual.label }}</h3>
          <p>Conteúdo geológico específico...</p>

          <div class="content-grid">
            <BiomaCard
              title="Relevo"
              subtitle="Características topográficas"
              button-label="Explorar"
              icon="pi pi-mountain"
            />

            <BiomaCard
              title="Clima"
              subtitle="Padrões climáticos"
              button-label="Explorar"
              icon="pi pi-cloud"
            />

            <BiomaCard
              title="Hidrografia"
              subtitle="Recursos hídricos"
              button-label="Explorar"
              icon="pi pi-water"
            />
          </div>
        </template>

        <template #imagens>
          <h3>Imagens do {{ biomaAtual.label }}</h3>
          <div class="content-grid">
            <BiomaCard
              title="Paisagem Típica"
              subtitle="Vista panorâmica"
              bg-color="#cfe1b9"
              icon="pi pi-image"
            />

            <BiomaCard
              title="Vegetação"
              subtitle="Diversidade de plantas"
              bg-color="#b7e4c7"
              icon="pi pi-tree"
            />

            <BiomaCard
              title="Fauna"
              subtitle="Animais característicos"
              bg-color="#95d5b2"
              icon="pi pi-star"
            />
          </div>
        </template>
      </BiomaContent>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const appState = inject('appState');

const biomaAtual = computed(() => {
  console.log(appState.biomas);
  return appState.biomas.find(b => b.id === route.params.bioma) || {};
});
</script>
