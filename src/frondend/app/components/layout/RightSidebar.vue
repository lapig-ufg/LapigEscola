<template>
  <aside class="right-menu">
    <div class="menu-section">
      <div class="menu-title">Temas do Bioma</div>
      <ul class="menu-items">
        <li v-for="tema in temas"
            :key="tema.id"
            :class="{ active: activeTema === tema.id }"
            @click="$emit('select-tema', tema.id)">
          {{ tema.label }}
        </li>
      </ul>
    </div>

    <div class="menu-section">
      <div class="menu-title">Elementos de Conteúdo</div>
      <ul class="menu-items">
        <li v-for="elemento in elementos"
            :key="elemento.id"
            :class="{ active: activeElemento === elemento.id }"
            @click="$emit('select-elemento', elemento.id)">
          {{ elemento.label }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  temas: Array,
  elementos: Array,
  activeTema: String,
  activeElemento: String
});

defineEmits(['select-tema', 'select-elemento']);
</script>
