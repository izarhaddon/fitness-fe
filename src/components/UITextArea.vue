<script setup lang="ts">
import UILabel from '@/components/UILabel.vue'

withDefaults(
  defineProps<{
    id: string
    label: string
    name: string
    disabled?: boolean
    required?: boolean
    readonly?: boolean
    rows?: number
  }>(),
  {
    rows: 4,
  },
)

const value = defineModel<string>(
  'value',
  {
    default: '',
  },
)
</script>

<template>
  <div>
    <UILabel
      :id="id"
      :label="label"
    />
    <textarea
      :id="id"
      v-model="value"
      :name="name"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
    />
  </div>
</template>
