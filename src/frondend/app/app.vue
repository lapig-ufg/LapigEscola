<template>
  <div class="app-container">
    <LayoutHeader @toggle-menu="toggleMobileMenu" />

    <LayoutLeftSidebar

    />
    <main>
      <NuxtPage />
    </main>



    <LayoutFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Estado reativo da aplicação
const mobileMenuActive = ref(false);
const activeItem = ref('visao-geral');
const activeBioma = ref('');
const activeTema = ref('localizacao');
const activeElemento = ref('texto');



// Métodos
const toggleMobileMenu = () => {
  mobileMenuActive.value = !mobileMenuActive.value;
};



// Fornecer estado para componentes filhos
provide('appState', {
  activeItem,
  activeBioma,
  activeTema,
  activeElemento
});
</script>

<style>
/* Estilos globais */
:root {
  --primary-color: #2c6e49;
  --secondary-color: #4c956c;
  --light-color: #d8f3dc;
  --dark-color: #1b4332;
  --accent-color: #f77f00;
  --text-color: #333;
  --bg-light: #f8f9fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: var(--bg-light);
  color: var(--text-color);
  overflow-x: hidden;
}

/* Layout */
.app-container {
  display: grid;
  grid-template-columns: 250px 1fr; /* Removida a terceira coluna */
  grid-template-rows: 80px 1fr 50px;
  grid-template-areas:
    "header header"
    "left-menu main"
    "footer footer";
  min-height: 100vh;
}

header {
  grid-area: header;
  background-color: var(--primary-color);
  color: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo i {
  font-size: 24px;
}

.logo h1 {
  font-size: 1.4rem;
  font-weight: 600;
}

.left-menu {
  grid-area: left-menu;
  background-color: white;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  overflow-y: auto;
  z-index: 100;
}


main {
  grid-area: main;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-light);
}

footer {
  grid-area: footer;
  background-color: var(--dark-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

/* Menu Styles */
.menu-section {
  margin-bottom: 20px;
}

.menu-title {
  padding: 10px 20px;
  background-color: var(--light-color);
  color: var(--dark-color);
  font-weight: 600;
  margin-bottom: 5px;
}

.menu-items {
  list-style: none;
}

.menu-items li {
  padding: 10px 20px;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-items li:hover {
  background-color: var(--light-color);
  border-left: 3px solid var(--accent-color);
}

.menu-items li.active {
  background-color: var(--light-color);
  border-left: 3px solid var(--accent-color);
  font-weight: 600;
}

/* Main Content Styles */
.page-title {
  color: var(--dark-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--secondary-color);
}

.map-container {
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.content-title {
  color: var(--dark-color);
  font-size: 1.4rem;
}

.back-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.p-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.p-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.card-image {
  height: 180px;
  background-color: var(--light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
}

/* Tabs */
.p-tabview .p-tabview-nav {
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 10px 20px;
  background: #f1f1f1;
  margin-right: 5px;
  border-radius: 5px 5px 0 0;
  border: none !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background: var(--secondary-color);
  color: white;
}

.bioma-tag {
  display: inline-block;
  padding: 5px 10px;
  background-color: var(--light-color);
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

.bioma-tag.active {
  background-color: var(--secondary-color);
  color: white;
}

/* Responsive */
@media (max-width: 992px) {
  .app-container {
    /* Esta media query agora é redundante pois é igual ao layout principal */
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header header"
      "left-menu main"
      "footer footer";
  }
}

@media (max-width: 768px) {
  .app-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }

  .left-menu, .right-menu {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }
}

/* Mobile menu */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.mobile-menu {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  background: white;
  z-index: 1000;
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  display: none;
}

.mobile-menu.active {
  display: block;
}

.mobile-menu-section {
  padding: 15px;
}



.content-wrapper {
  overflow: hidden;
  word-wrap: break-word;
}

.content-wrapper figure img {
  max-width: 80%;
  height: auto;
  display: block;
  margin: 1rem auto;
}

.content-wrapper iframe,
.content-wrapper video {
  max-width: 100%;
  display: block;
  margin: 1rem auto;
}

/* Estilos para outros elementos que podem vir do CKEditor */
.content-wrapper table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  overflow-x: auto;
  display: block;
}

.content-wrapper table td,
.content-wrapper table th {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>


