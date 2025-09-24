<template>
  <div>
    <div v-if="pending" class="loading">Carregando página...</div>
    <div v-else-if="error" class="error">Erro ao carregar página</div>
    <div v-else>
      <h1 class="page-title">{{ pageData.titulo }}</h1>

      <!-- Seção de arquivo -->
      <div v-if="pageData.file" class="content-section">
        <Button
          :label="getButtonLabel()"
          :icon="getButtonIcon()"
          @click="handleFile"
          class="p-button-primary"
        />
        <Button
          label="Forçar Download"
          icon="pi pi-download"
          @click="downloadFile"
          class="p-button-secondary ml-2"
          v-if="isViewableFile()"
        />
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
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const itemId = route.params.id
const typePage = route.params.type

const { data: pageData, pending, error } = await useAsyncData(
  `${typePage}-${itemId}`,
  () => $fetch(`${runtimeConfig.public.apiBase}pages/${typePage}/${itemId}`)
);

// Função para obter extensão do arquivo
const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
}

// Função para verificar se o arquivo é visualizável no navegador
const isViewableFile = () => {
  if (!pageData.value?.file) return false;

  const extension = getFileExtension(pageData.value.file);
  const viewableExtensions = [
    'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
    'txt', 'html', 'htm', 'mp4', 'webm', 'ogg', 'mp3', 'wav'
  ];

  return viewableExtensions.includes(extension);
}

// Função para obter o rótulo do botão baseado no tipo de arquivo
const getButtonLabel = () => {
  if (!pageData.value?.file) return 'Arquivo';

  const extension = getFileExtension(pageData.value.file);

  switch (extension) {
    case 'pdf':
      return 'Ver PDF';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return 'Ver Imagem';
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'Ver Vídeo';
    case 'mp3':
    case 'wav':
      return 'Ouvir Áudio';
    case 'txt':
    case 'html':
    case 'htm':
      return 'Ver Documento';
    case 'doc':
    case 'docx':
      return 'Baixar Word';
    case 'xls':
    case 'xlsx':
      return 'Baixar Excel';
    case 'ppt':
    case 'pptx':
      return 'Baixar PowerPoint';
    case 'zip':
    case 'rar':
    case '7z':
      return 'Baixar Arquivo';
    default:
      return isViewableFile() ? 'Ver Arquivo' : 'Baixar Arquivo';
  }
}

// Função para obter o ícone do botão baseado no tipo de arquivo
const getButtonIcon = () => {
  if (!pageData.value?.file) return 'pi pi-file';

  const extension = getFileExtension(pageData.value.file);

  switch (extension) {
    case 'pdf':
      return 'pi pi-file-pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return 'pi pi-image';
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'pi pi-video';
    case 'mp3':
    case 'wav':
      return 'pi pi-volume-up';
    case 'doc':
    case 'docx':
      return 'pi pi-file-word';
    case 'xls':
    case 'xlsx':
      return 'pi pi-file-excel';
    case 'ppt':
    case 'pptx':
      return 'pi pi-desktop';
    case 'zip':
    case 'rar':
    case '7z':
      return 'pi pi-download';
    case 'txt':
      return 'pi pi-file-edit';
    default:
      return isViewableFile() ? 'pi pi-external-link' : 'pi pi-download';
  }
}

// Função principal - comportamento inteligente baseado no tipo de arquivo
const handleFile = () => {
  if (!pageData.value?.file) {
    console.warn('Nenhum arquivo disponível');
    return;
  }

  if (isViewableFile()) {
    // Arquivos visualizáveis → abrir em nova aba
    openInNewTab();
  } else {
    // Outros arquivos → forçar download
    downloadFile();
  }
}

// Função para baixar o arquivo
const downloadFile = () => {
  if (pageData.value?.file) {
    const link = document.createElement('a');
    link.href = pageData.value.file;

    // Tentar extrair nome do arquivo da URL ou usar título
    const urlParts = pageData.value.file.split('/');
    const fileName = urlParts[urlParts.length - 1] ||
                    `${pageData.value.titulo || 'arquivo'}.${getFileExtension(pageData.value.file)}`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Função para abrir em nova aba
const openInNewTab = () => {
  if (pageData.value?.file) {
    window.open(pageData.value.file, '_blank', 'noopener,noreferrer');
  }
}

// Set meta tags
useHead({
  title: computed(() => pageData.value?.titulo || 'Página'),
  meta: [
    {
      name: 'description',
      content: computed(() => pageData.value?.resumo || 'Conteúdo da página')
    }
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
