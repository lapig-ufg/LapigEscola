<script setup lang="ts">
import { useLayoutSwitcher } from '/@src/stores/layoutSwitcher'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'

const panels = usePanels()
const layoutSwitcher = useLayoutSwitcher()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Maps 1')

useHead({
  title: 'Maps 1 - Sidebar - Vuero',
})
</script>

<template>
  <component
    :is="layoutSwitcher.dynamicLayoutComponent as any"
    v-bind="layoutSwitcher.dynamicLayoutProps"
    close-on-change
    default-sidebar="dashboard"
    nowrap
  >
    <MapsDashboard>
      <template #header>
        <div class="content-section-header">
        </div>
      </template>
    </MapsDashboard>
  </component>
</template>
