<template>
  <div>
    <Card>
      <template #header>
        <div class="image-container">
          <img
            :src="image || baseImage"
            :alt="title"
            style="width: 100%"
          />

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

      <template #footer v-if="buttonLabel || file || $slots.footer">
        <slot name="footer">
          <Button
            v-if="buttonLabel"
            :label="buttonLabel"
            class="p-button-success"
            @click="handleButtonClick"
          />
          <DownloadButton v-if="file"
              :title="title"
              :file="file"
          />
        </slot>
      </template>
    </Card>
  </div>
</template>

<script setup>

import DownloadButton from '~/components/content/DownloadButton.vue'

const runtimeConfig = useRuntimeConfig();
const props = defineProps({
  title: String,
  subtitle: String,
  buttonLabel: String,
  image: String,
  cardType: String,
  cardId: [String, Number],
  file: String

});

const baseImage = runtimeConfig.public.appBaseImage
// Define emits
const emit = defineEmits(['button-click']);


const handleButtonClick = () => {
  emit('button-click', {
    type: props.cardType,
    id: props.cardId
  });
};


</script>

<style scoped>


.image-container {
  position: relative;
  cursor: pointer;
  overflow: hidden;
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


</style>
