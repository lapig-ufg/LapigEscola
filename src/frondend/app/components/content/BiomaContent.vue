<template>
  <TabView>
    <!-- Aba Conteúdo só aparece se houver conteúdo -->
    <TabPanel v-if="hasTexto" header="Conteúdo">
      <slot name="texto"></slot>
    </TabPanel>

    <!-- Aba Imagens só aparece se houver imagens -->
    <TabPanel v-if="hasImagens" header="Imagens">
      <slot name="imagens"></slot>
    </TabPanel>

    <!-- Aba Vídeos só aparece se houver vídeos -->
    <TabPanel v-if="hasVideos" header="Vídeos">
      <slot name="videos"></slot>
    </TabPanel>

    <!-- Aba Curiosidades só aparece se houver curiosidades -->
    <TabPanel v-if="hasCuriosidades" header="Curiosidades">
      <slot name="curiosidades"></slot>
    </TabPanel>


    <TabPanel v-if="hasPedagogia" header="Recursos Pedagógicos">
      <slot name="pedagogia"></slot>
    </TabPanel>



  </TabView>
</template>

<script setup>
import { useSlots, computed } from 'vue'

// Pega os slots disponíveis
const slots = useSlots()

// Função auxiliar para verificar se um slot tem conteúdo
const hasSlotContent = (slotName) => {
  if (!slots[slotName]) return false

  const slotContent = slots[slotName]()

  // Verifica se tem conteúdo real (não apenas espaços vazios ou comentários)
  return slotContent && slotContent.some(vnode => {
    // Verifica se é um nó de texto com conteúdo
    if (vnode.type === Text) {
      return vnode.children && vnode.children.trim() !== ''
    }
    // Se for um elemento, considera que tem conteúdo
    return true
  })
}

// Computed properties para cada slot
const hasTexto = computed(() => hasSlotContent('texto'))
const hasImagens = computed(() => hasSlotContent('imagens'))
const hasVideos = computed(() => hasSlotContent('videos'))
const hasCuriosidades = computed(() => hasSlotContent('curiosidades'))
const hasPedagogia = computed(() => hasSlotContent('pedagogia'))
</script>
