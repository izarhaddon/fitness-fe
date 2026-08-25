<script setup lang="ts">
import { NLayoutContent } from 'naive-ui'
</script>

<template>
  <NLayoutContent
    class="app-content"
    content-style="padding: 24px;"
  >
    <RouterView />
  </NLayoutContent>
</template>

<style scoped>
.app-content {
  height: calc(100vh - 60px);
}
</style>
