<script setup lang="ts">
import { NLayout } from 'naive-ui'
import LoginLayoutHeader from '@/layouts/LoginLayout/components/LoginLayoutHeader.vue'
import LoginLayoutContent from '@/layouts/LoginLayout/components/LoginLayoutContent.vue'
</script>

<template>
  <NLayout position="absolute">
    <LoginLayoutHeader />
    <LoginLayoutContent />
  </NLayout>
</template>

<style scoped></style>
