<template>
  <div>
    <div v-if="pending" class="loading">Carregando página...</div>
    <div v-else-if="error" class="error">Erro ao carregar página: {{ error.message }}</div>
    <div v-else>
      <h1 class="page-title">{{ pageData.titulo }}</h1>
      <div class="content-section">
        <div class="content-wrapper" v-html="pageData.conteudo"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const { data: pageData, pending, error } = await useAsyncData(
  `page-${route.params.slug}`,
  () => $fetch(`${runtimeConfig.public.apiBase}pages/get/${route.params.slug}`)
);


// Set meta tags
useHead({
  title: pageData.value?.titulo || 'Página',
  meta: [
    {
      name: 'description',
      content: pageData.value?.resumo || 'Conteúdo da página'
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
}

.content-section {
  line-height: 1.6;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
  text-align: center;
  padding: 2rem;
}



</style>

