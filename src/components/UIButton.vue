<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="ui-button"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  border: 1px solid darkgray;
  border-radius: 4px;
}
</style>
