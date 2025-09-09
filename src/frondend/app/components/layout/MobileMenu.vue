<template>
  <div class="mobile-menu" :class="{ active: isOpen }">
    <div class="mobile-menu-section">
      <h3>Menu Principal</h3>
      <div class="mobile-tags">
        <span v-for="item in menuItems"
              :key="'m-'+item.id"
              class="bioma-tag"
              :class="{ active: activeItem === item.id }"
              @click="$emit('select-item', item.id)">
          {{ item.label }}
        </span>
      </div>
    </div>

    <div class="mobile-menu-section">
      <h3>Biomas</h3>
      <div class="mobile-tags">
        <span v-for="bioma in biomas"
              :key="'b-'+bioma.id"
              class="bioma-tag"
              :class="{ active: activeBioma === bioma.id }"
              @click="$emit('select-bioma', bioma.id)">
          {{ bioma.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  menuItems: Array,
  biomas: Array,
  activeItem: String,
  activeBioma: String
});

defineEmits(['select-item', 'select-bioma']);
</script>

<style scoped>
.mobile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}
</style>
