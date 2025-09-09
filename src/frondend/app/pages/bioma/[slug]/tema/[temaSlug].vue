<!-- pages/biomas/[bioma].vue -->
<template>
  <div>
    <h1 class="page-title">{{ conteudo.titulo }}</h1>

    <div class="content-section">

      <div class="controls">
              <h3>Visualizar Tema:</h3>
              <div v-if="isLoadingFocus" class="loading-indicator">
                <span class="spinner"></span> Centralizando mapa...
              </div>
              <hr>
              <!-- Checkboxes são controlados automaticamente pela função loadTheme -->
              <h3>Camadas Ativas:</h3>
              <div v-if="layersToShowOnMap.length === 0">Nenhum tema selecionado.</div>
              <div v-for="layer in layersToShowOnMap" :key="layer.id">
                - {{ layer.title }}
              </div>
            </div>
            <div ref="mapContainer" class="map-container"></div>
      <BiomaContent :title="`${conteudo.titulo}`">
        <template #texto>

            <div class="content-wrapper" v-html="conteudo.texto"></div>

        </template>

        <template #imagens>
          <h3>Imagens</h3>
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

import { useRoute } from 'vue-router';
import { ref } from 'vue';


const route = useRoute();
const biomaSlug = route.params.slug
const temaSlug = route.params.temaSlug

// 2. Fazer as duas chamadas de API separadas usando await
// O componente irá "esperar" aqui até que ambas as chamadas terminem.
// Supondo que `useAPI` retorna um objeto com uma propriedade `data`
const { data: conteudo } = await useAPI(`bioma/conteudo/${biomaSlug}/tema/${temaSlug}`);
const { data: themeData } = await useAPI(`bioma/layers/${biomaSlug}/tema/${temaSlug}`);

// 3. Preparar os dados para o mapa a partir dos resultados da API
// Como `await` já concluiu, `themeData` já contém os dados.
// Usamos `ref` para passar os valores para o composable do mapa.
const layersToShowOnMap = computed(() => themeData.value?.layers || []);
const focusUrl = computed(() => themeData.value?.focusFeatureUrl || null);

// 4. Lógica do Mapa
const mapContainer = ref(null);

// Passamos as `refs` com os dados já carregados para o composable.
// A mágica do `watch` dentro de `useOpenLayers` vai detectar esses valores iniciais
// e configurar o mapa assim que ele for montado.
const { isLoadingFocus } = useOpenLayers(
  mapContainer,
  layersToShowOnMap,
  focusUrl
);

</script>

<style>
/* Importa o CSS do OpenLayers */
@import 'ol/ol.css';
.map-container {
  width: 100%;
  height: 50vh;
  border: 1px solid #ccc;
}
.controls {
  padding: 10px;
  background-color: #f2f2f2;
  margin-bottom: 10px;
}
</style>
