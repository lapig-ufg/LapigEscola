<!-- pages/index.vue -->
<template>
  <div>
    <h1 class="page-title">Bem-vindo ao Atlas dos Biomas Brasileiros</h1>

    <div class="content-section">
      <h2 class="content-title">Conheça nossos biomas</h2>

      <div class="content-grid">
        <BiomaCard
          v-for="bioma in appState.biomas"
          :key="bioma.id"
          :title="bioma.label"
          subtitle="Explore este bioma"
          button-label="Ver detalhes"
          :icon="bioma.icon"
          @click="navigateToBioma(bioma.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const appState = inject('appState');

const navigateToBioma = (biomaId) => {
  appState.activeBioma = biomaId;
  router.push(`/biomas/${biomaId}`);
};
</script>
