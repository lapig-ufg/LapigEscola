<!-- pages/biomas/[bioma].vue -->
<template>
  <div>
    <h1 class="page-title">{{ conteudo.titulo }}</h1>

    <div class="content-section">

      <div  v-if="layersToShowOnMap.length > 0" ref="mapContainer" class="map-container"></div>


      <BiomaContent :title="`${conteudo.titulo}`">
        <template #texto>

            <div class="content-wrapper" v-html="conteudo.texto"></div>

        </template>

        <template v-if="imagesData.length > 0" #imagens>
          <h3>Imagens</h3>
          <div class="content-grid">
            <div  v-for="imagem in imagesData">
            <ImageCard
              :title="imagem.titulo"
              :subtitle="imagem.resumo"
              :image="imagem.imagem"
            />
              </div>
          </div>
        </template>

        <template v-if="curiosidadesData.length > 0" #curiosidades>
          <h3>Curiosidades</h3>
          <div class="content-grid">
            <div  v-for="curiosidade in curiosidadesData">
            <InfoCard
              :title="curiosidade.titulo"
              :subtitle="curiosidade.resumo"
              :image="curiosidade.imagem"
              button-label="Leia Mais"
              cardType="curiosidade"
              :cardId="curiosidade.id"

              @button-click="handleCardAction"

            />
              </div>
          </div>
        </template>



        <template v-if="pedagogiaData.length > 0" #pedagogia>
          <h3>Recursos Pedagógicos</h3>
          <div class="content-grid">
            <div  v-for="pedagogia in pedagogiaData">
            <InfoCard
              :title="pedagogia.titulo"
              :subtitle="pedagogia.resumo"
              :image="pedagogia.imagem"
              button-label="Leia Mais"
              cardType="pedagogia"
              :cardId="pedagogia.id"
              :file="pedagogia.file"
              @button-click="handleCardAction"

            />
              </div>
          </div>
        </template>


      </BiomaContent>
    </div>
  </div>
</template>

<script setup>

import { useRoute } from 'vue-router';

import { ref } from 'vue';
import ImageCard from '~/components/content/ImageCard.vue'
import BiomaContent from '~/components/content/BiomaContent.vue'
import InfoCard from '~/components/content/InfoCard.vue'

const runtimeConfig = useRuntimeConfig();
const baseImage = runtimeConfig.public.appBaseImage

const route = useRoute();
const biomaSlug = route.params.slug
const temaSlug = route.params.temaSlug
const rootPath = `bioma/${biomaSlug}/tema/${temaSlug}`
// 2. Fazer as duas chamadas de API separadas usando await
// O componente irá "esperar" aqui até que ambas as chamadas terminem.
// Supondo que `useAPI` retorna um objeto com uma propriedade `data`
const { data: conteudo } = await useAPI(`${rootPath}/conteudo`);




const { data: themeData } = await useAPI(`${rootPath}/layers`);

const { data: images } = await useAPI(`${rootPath}/image`);

const { data: curiosidades } = await useAPI(`${rootPath}/curiosidades`);

const { data: pedagogias } = await useAPI(`${rootPath}/pedagogias`);

// 3. Preparar os dados para o mapa a partir dos resultados da API
// Como `await` já concluiu, `themeData` já contém os dados.
// Usamos `ref` para passar os valores para o composable do mapa.
const layersToShowOnMap = computed(() => themeData.value?.layers || []);
const focusUrl = computed(() => themeData.value?.focusFeatureUrl || null);
const imagesData = computed(() => images.value || null)

const curiosidadesData = computed(() => curiosidades.value || null)

const pedagogiaData = computed(() => pedagogias.value || null)


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




const router = useRouter();

// Função que recebe type e id do card clicado
const handleCardAction = (data) => {
  console.log('Card clicado:', data);
  // data = { type: 'product', id: 123 }

  // Você pode usar switch/case para diferentes ações baseadas no tipo
  switch(data.type) {
    case 'curiosidade':
      // Navegar para página de produto
      router.push(`${temaSlug}/curiosidade-${data.id}`);
      break;

    case 'pedagogia':
      // Navegar para página de artigo
      router.push(`${temaSlug}/pedagogia-${data.id}`);
      break;



    default:
      console.log('Tipo de card não reconhecido:', data.type);
  }
};




useHead({
  title: computed(() => conteudo.value?.titulo || 'Página'),
  meta: [
    {
      name: 'description',
      content: computed(() => conteudo.value?.resumo || 'Conteúdo da página')
    },
    {
      property: 'og:image',
      content: computed(() => {
        const imagem = conteudo.value?.imagem;
        return imagem ? imagem : baseImage;
      })
    },
  ]
});
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
