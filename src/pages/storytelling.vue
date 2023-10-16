<script setup lang="ts">

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Blank Page 1')

useHead({
  title: 'Blank Page 1 - Sidebar - Vuero',
})
</script>

<template>
  <SidebarLayout>
    <!-- Content Wrapper -->
    <div class="page-content-inner">

    </div>

    <Conteudo>
      <template #header>
        <div class="content-section-header">
        </div>
      </template>
    </Conteudo>
  </SidebarLayout>
</template>
