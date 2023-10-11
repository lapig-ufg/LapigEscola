<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Onboarding Page 2')

useHead({
  title: 'Onboarding Page 2 - Sidebar - Vuero',
})
</script>

<template>
  <div class="view-wrapper">
    <div class="page-content-inner">
      <OnboardingV2 />
    </div>
  </div>
</template>
