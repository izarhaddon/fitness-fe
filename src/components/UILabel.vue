<script setup lang="ts">
defineProps<{
  id: string
  label: string
}>()
</script>

<template>
  <label
    class="ui-label"
    :for="id"
  >{{ label }}</label>
</template>

<style scoped lang="scss">
.ui-label {
  margin-bottom: 4px;
}
</style>
