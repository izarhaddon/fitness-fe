<script setup lang="ts">
import ViewLayout from '@/components/ViewLayout.vue'
import UIModalProvider from '@/components/UIModalProvider/UIModalProvider.vue'
</script>

<template>
  <UIModalProvider>
    <ViewLayout>
      <RouterView/>
    </ViewLayout>
  </UIModalProvider>
</template>
