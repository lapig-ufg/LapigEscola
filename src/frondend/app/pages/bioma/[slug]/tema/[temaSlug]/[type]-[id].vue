<template>
  <div>
    <div v-if="pending" class="loading">Carregando página...</div>
    <div v-else-if="error" class="error">Erro ao carregar página</div>
    <div v-else>
      <h1 class="page-title">{{ pageData.titulo }}</h1>

      <!-- Seção de arquivo -->
      <div v-if="pageData.file" class="content-section">

        <DownloadButton :title="pageData.titulo" :file="pageData.file"></DownloadButton>

      </div>

      <!-- Seção de conteúdo -->
      <div class="content-section">
        <img
          v-if="pageData.imagem"
          :src="pageData.imagem"
          :alt="pageData.titulo"
          style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;"
        >
        <div class="content-wrapper" v-html="pageData.texto"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DownloadButton from '~/components/content/DownloadButton.vue'

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const itemId = route.params.id
const typePage = route.params.type

const { data: pageData, pending, error } = await useAsyncData(
  `${typePage}-${itemId}`,
  () => $fetch(`${runtimeConfig.public.apiBase}pages/${typePage}/${itemId}`)
);




// Set meta tags
useHead({
  title: computed(() => pageData.value?.titulo || 'Página'),
  meta: [
    {
      name: 'description',
      content: computed(() => pageData.value?.resumo || 'Conteúdo da página')
    },
    {
      property: 'og:image',
      content: computed(() => {
        const imagem = pageData.value?.imagem;
        return imagem ? imagem : runtimeConfig.public.appBaseImage;
      })
    },
  ]
});
</script>

<style scoped>
.page-title {
  margin-bottom: 1rem;
  color: #2c5530;
  font-size: 2rem;
}

.content-section {
  line-height: 1.6;
  margin-bottom: 2rem;
}

.content-wrapper {
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
  text-align: center;
  padding: 2rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

/* Espaçamento entre botões */
.ml-2 {
  margin-left: 0.5rem;
}

/* Responsividade para botões em telas pequenas */
@media (max-width: 768px) {
  .content-section .p-button {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .ml-2 {
    margin-left: 0;
  }
}
</style>
