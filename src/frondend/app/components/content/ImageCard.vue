<template>
  <div>
    <Card>
      <template #header v-if="image">
        <div class="image-container" @click="openImageModal">
          <img
            :src="image"
            :alt="title"
            class="clickable-image"
          />
          <div class="image-overlay">
            <i class="pi pi-search-plus"></i>
          </div>
        </div>
      </template>

      <template #title v-if="title">
        {{ title }}
      </template>

      <template #subtitle v-if="subtitle">
        {{ subtitle }}
      </template>

      <template #content v-if="$slots.default">
        <slot></slot>
      </template>

      <template #footer v-if="buttonLabel || $slots.footer">
        <slot name="footer">
          <Button
            v-if="buttonLabel"
            :label="buttonLabel"
            class="p-button-success"
            @click="$emit('button-click')"
          />
        </slot>
      </template>
    </Card>

    <!-- Modal para exibir a imagem -->
    <Dialog
      v-model:visible="imageModalVisible"
      :header="title || 'Imagem'"
      :modal="true"
      :dismissableMask="true"
      :draggable="false"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :contentStyle="{ padding: 0 }"
    >
      <div class="image-modal-content">
        <img
          :src="image"
          :alt="title"
          class="modal-image"
        />
      </div>

      <template #footer>
        <Button
          label="Fechar"
          icon="pi pi-times"
          @click="imageModalVisible = false"
          class="p-button-text"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';



// Define props
const props = defineProps({
  title: String,
  subtitle: String,
  buttonLabel: String,
  image: String,
  bgColor: {
    type: String,
    default: 'var(--light-color)'
  }
});

// Define emits
const emit = defineEmits(['button-click']);

// Estado do modal
const imageModalVisible = ref(false);

// Função para abrir o modal
const openImageModal = () => {
  imageModalVisible.value = true;
};

// Computed para estilo do card
const cardStyle = computed(() => ({
  backgroundColor: props.bgColor
}));
</script>

<style scoped>
.content-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.clickable-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-overlay i {
  font-size: 2.5rem;
  color: white;
}

.image-container:hover .clickable-image {
  transform: scale(1.05);
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.image-modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  min-height: 200px;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

/* Estilo para o diálogo */
:deep(.p-dialog-header) {
  padding: 1rem 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 0 !important;
}

:deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
