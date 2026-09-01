<script setup lang="ts">
import HeaderMobile from '@/components/HeaderMobile.vue'
</script>

<template>
  <div class="view-layout">
    <HeaderMobile/>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.view-layout {
  padding: 60px 16px 16px;
}
</style>
