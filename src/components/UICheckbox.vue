<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    label: string
    name: string
  }>(),
  {
    label: '',
  },
)

const value = defineModel<boolean>(
  'value',
  {
    default: false,
  },
)
</script>

<template>
  <label :for="id">
    <input
      :id="id"
      :name="name"
      type="checkbox"
      v-model="value"
    />
    <span v-if="label">{{label}}</span>
  </label>
</template>

<style scoped></style>
