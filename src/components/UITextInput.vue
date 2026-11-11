// src/components/UITextInput.vue
<script setup lang="ts">
import UILabel from '@/components/UILabel.vue'

withDefaults(
  defineProps<{
    id: string
    label: string
    name: string
    type?: 'text' | 'password' | 'email' | 'number'
    disabled?: boolean
    required?: boolean
    readonly?: boolean
  }>(),
  {
    type: 'text',
  },
)

const value = defineModel<string | number>(
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
    <input
      :id="id"
      v-model="value"
      :type="type"
      :name="name"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
    />
  </div>
</template>
