<template>
  <Button
          :label="getButtonLabel()"
          :icon="getButtonIcon()"
          @click="handleFile"
          class="p-button-primary"
        />
</template>


<script setup>

const props = defineProps({
  title: String,
  file: String
});



// Função para obter extensão do arquivo
const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
}

// Função para verificar se o arquivo é visualizável no navegador
const isViewableFile = () => {
  if (!props.file) return false;

  const extension = getFileExtension(props.file);
  const viewableExtensions = [
    'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
    'txt', 'html', 'htm', 'mp4', 'webm', 'ogg', 'mp3', 'wav'
  ];

  return viewableExtensions.includes(extension);
}

// Função para obter o rótulo do botão baseado no tipo de arquivo
const getButtonLabel = () => {
  if (!props.file) return 'Arquivo';

  const extension = getFileExtension(props.file);

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
  if (!props.file) return 'pi pi-file';

  const extension = getFileExtension(props.file);

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
  if (!props.file) {
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
  if (props.file) {
    const link = document.createElement('a');
    link.href = props.file;

    // Tentar extrair nome do arquivo da URL ou usar título
    const urlParts = props.file.split('/');
    const fileName = urlParts[urlParts.length - 1] ||
                    `${props.title || 'arquivo'}.${getFileExtension(props.file)}`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Função para abrir em nova aba
const openInNewTab = () => {
  if (props.file) {
    window.open(props.file, '_blank', 'noopener,noreferrer');
  }
}

</script>
