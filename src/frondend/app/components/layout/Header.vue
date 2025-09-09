<template>
  <header>
    <div class="logo">
      <i class="pi pi-book"></i>
      <h1>MapBiomas na Escola - Atlas dos Biomas</h1>
    </div>
    <Button
      class="mobile-menu-button"
      icon="pi pi-bars"
      @click="$emit('toggle-menu')"
    />
  </header>
</template>

<script setup>
import { defineEmits } from 'vue';

defineEmits(['toggle-menu']);
</script>
