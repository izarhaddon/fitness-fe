<script setup lang="ts">
import NavigationComponent from '@/components/NavigationComponent/NavigationComponent.vue'
</script>

<template>
  <header class="header-mobile">
    <NavigationComponent/>
  </header>
</template>

<style lang="scss" scoped>
.header-mobile {
  --header-bg-color: white;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--header-bg-color);
}
</style>
