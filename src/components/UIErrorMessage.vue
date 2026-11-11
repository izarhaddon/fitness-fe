// src/components/UIErrorMessage.vue

<script setup lang="ts">
defineProps<{
  message: string | null
}>()
</script>

<template>
  <p
    v-if="message"
    class="ui-error-message"
    role="alert"
  >
    {{ message }}
  </p>
</template>

<style scoped lang="scss">
.ui-error-message {
  margin: 0 0 12px;
  padding: 8px 12px;
  border: 1px solid #f1b5b5;
  border-radius: 6px;
  background: #fdecec;
  color: #a12020;
}
</style>
