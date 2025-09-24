<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbItems.length - 1 }"
      >
        <NuxtLink
          v-if="item.to && index !== breadcrumbItems.length - 1"
          :to="item.to"
          class="breadcrumb-link"
        >
          <Icon v-if="item.icon" :name="item.icon" class="breadcrumb-icon" />
          {{ item.label }}
        </NuxtLink>
        <span v-else class="breadcrumb-current">
          <Icon v-if="item.icon" :name="item.icon" class="breadcrumb-icon" />
          {{ item.label }}
        </span>
        <Icon
          v-if="index < breadcrumbItems.length - 1"
          name="pi:chevron-right"
          class="breadcrumb-separator"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const breadcrumbItems = computed(() => {
  if (props.items.length === 0) {
    return [
      {
        label: 'Home',
        to: '/',
        icon: 'pi:home'
      }
    ];
  }
  return props.items;
});
</script>

<style scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0.75rem 0;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  color: var(--p-text-muted-color);
}

.breadcrumb-item:not(.active) {
  color: var(--p-text-color);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--p-primary-color);
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--p-primary-500);
  text-decoration: underline;
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  color: var(--p-text-muted-color);
  font-weight: 500;
}

.breadcrumb-icon {
  margin-right: 0.25rem;
  font-size: 0.75rem;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .breadcrumb {
    font-size: 0.8rem;
  }

  .breadcrumb-separator {
    margin: 0 0.25rem;
  }
}
</style>