<template>
  <aside class="left-menu">
    <div class="menu-section">
      <div class="menu-title">A Iniciativa</div>
      <ul class="menu-items">
        <li v-for="item in menuItems"
            :key="item.id"
            :class="{ active: $route.path === `/page/${item.slug}`}"
            @click="navigateToPage(item.slug)">
          {{ item.label }}
        </li>
      </ul>
    </div>

     <div class="menu-section">
      <div class="menu-title">Biomas Brasileiros</div>
      <ul class="menu-items">
        <li v-for="bioma in biomas"
            :key="bioma.slug"
            class="bioma-item"
            :class="{ expanded: expandedBiomas.includes(bioma.slug) }">
          <div
            class="bioma-header"
            :class="{ active: isBiomaActive(bioma.slug) }"
            @click="toggleBioma(bioma.slug)"
          >
            <span>{{ bioma.nome }}</span>
            <span class="dropdown-icon">
              {{ expandedBiomas.includes(bioma.slug) ? '−' : '+' }}
            </span>
          </div>

          <ul class="submenu-items">
            <li
              v-for="tema in bioma.temas"
              :key="tema.slug"
              :class="{ active: isTemaActive(bioma.slug, tema.slug) }"
              @click.stop="navigateToTema(bioma.slug, tema.slug)"
            >
              {{ tema.nome }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAPI from '~/composables/useAPI.js'

// Dados fixos da aplicação

const route = useRoute();
const router = useRouter();



defineEmits(['select-item', 'select-bioma']);

const menuapi = await useAPI('pages/menu')
const menuItems = ref(menuapi.data);

const expandedBiomas = ref([]);

// Dados de exemplo (substitua pelos seus dados reais)
const biomaapi = await useAPI('bioma/list')
const biomas = biomaapi.data

// Verifica se o bioma está ativo (rota atual)
const isBiomaActive = (slug) => {
  return route.params.slug === slug && !route.params.temaSlug;
};

// Verifica se o tema está ativo
const isTemaActive = (biomaSlug, temaSlug) => {
  return route.params.slug === biomaSlug && route.params.temaSlug === temaSlug;
};

const toggleBioma = (biomaId) => {
  const index = expandedBiomas.value.indexOf(biomaId);
  if (index > -1) {
    expandedBiomas.value.splice(index, 1); // Remove se já estiver expandido
  } else {
    expandedBiomas.value.push(biomaId); // Adiciona se não estiver expandido
  }
};

const navigateToPage = (slug) => {
  router.push(`/page/${slug}`)
}


// Navega para um tema específico
const navigateToTema = (biomaSlug, temaSlug) => {
  router.push(`/bioma/${biomaSlug}/tema/${temaSlug}`);
};

// Expande automaticamente o bioma da rota atual
const currentBioma = biomas.value.find(b => b.slug === route.params.slug);
if (currentBioma) {
  expandedBiomas.value.push(currentBioma.slug);
}
</script>

<style scoped>
.bioma-item {
  margin-bottom: 2px;
}

.bioma-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.bioma-header:hover {
  background-color: var(--light-color);
}

.bioma-header.active {
  background-color: var(--light-color);
  color: var(--primary-color);
  font-weight: 500;
}

.dropdown-icon {
  font-weight: bold;
  font-size: 1em;
  transition: transform 0.2s;
}

.bioma-item.expanded .dropdown-icon {
  transform: rotate(180deg);
}

.submenu-items {
  list-style: none;
  padding-left: 15px;
  margin-top: 2px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  max-height: 0;
}

.bioma-item.expanded .submenu-items {
  max-height: 500px;
}

.submenu-items li {
  padding: 8px 20px 8px 30px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
  border-left: 2px solid transparent;
  margin-bottom: 2px;
}

.submenu-items li:hover {
  background-color: rgba(216, 243, 220, 0.3);
}

.submenu-items li.active {
  background-color: var(--light-color);
  border-left: 2px solid var(--accent-color);
  color: var(--primary-color);
  font-weight: 500;
}
</style>
