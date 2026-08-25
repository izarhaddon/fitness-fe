<script setup lang="ts">
import { NLayout } from 'naive-ui'
import DefaultLayoutHeader from '@/layouts/DefaultLayout/components/DefaultLayoutHeader.vue'
import DefaultLayoutContent from '@/layouts/DefaultLayout/components/DefaultLayoutContent.vue'
</script>

<template>
  <NLayout position="absolute">
    <DefaultLayoutHeader />
    <DefaultLayoutContent />
  </NLayout>
</template>

<style scoped>

</style>
