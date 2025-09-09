<template>
  <div>
    <div class="content-header">
      <h2 class="content-title">{{ title }}</h2>
      <Button
        icon="pi pi-home"
        label="Voltar à página inicial"
        class="p-button-warning"
      />
    </div>



    <TabView>
      <TabPanel header="Texto">
        <slot name="texto"></slot>
      </TabPanel>
      <TabPanel header="Imagens">
        <slot name="imagens"></slot>
      </TabPanel>
      <TabPanel header="Vídeos">
        <slot name="videos"></slot>
      </TabPanel>
      <TabPanel header="Curiosidades">
        <slot name="curiosidades"></slot>
      </TabPanel>
      <TabPanel header="Faça seu mapa">
        <slot name="mapa"></slot>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>



defineProps({
  title: String
});
</script>
