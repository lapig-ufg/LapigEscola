<template>
  <Card class="content-card">
    <template #header>
      <div class="card-image" :style="{ backgroundColor: bgColor }">
        <i :class="icon" :style="{ fontSize: '3rem', color: iconColor }"></i>
      </div>
    </template>
    <template #title>
      {{ title }}
    </template>
    <template #subtitle>
      {{ subtitle }}
    </template>
    <template #footer v-if="buttonLabel">
      <Button :label="buttonLabel" class="p-button-success" />
    </template>
    <template #content v-if="$slots.default">
      <slot></slot>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  buttonLabel: String,
  bgColor: {
    type: String,
    default: 'var(--light-color)'
  },
  icon: String,
  iconColor: {
    type: String,
    default: 'var(--secondary-color)'
  }
});
</script>
