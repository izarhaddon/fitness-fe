<script setup lang="ts">
import { computed } from 'vue'
import UILabel from '@/components/UILabel.vue'

type Item = { value: string, label: string }

const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    name: string
    selected: string | Item
    options: Item[]
    isObject?: boolean
    disabled?: boolean
  }>(),
  {
    isObject: () => false,
    options: () => [],
  },
)

const emits = defineEmits<{
  (e: 'update:selected', selected: string | Item): void
}>()

function changeValue(event: Event) {
  const target = event.target as HTMLSelectElement

  const selectedItem = props.options.find(item => item.value === target.value)

  if (selectedItem) {
    emits(
      'update:selected',
      props.isObject ? selectedItem : selectedItem.value,
    )
  }
}

const selectedValue = computed(() => {
  if (props.selected && typeof props.selected === 'object') {
    return props.selected.value
  }
  return props.selected
})
</script>

<template>
  <div>
    <UILabel
      v-if="label"
      :id="id"
      :label="label"
    />
    <select
      :id="id"
      :name="name"
      :value="selectedValue"
      :disabled="disabled"
      @change="changeValue"
    >
      <option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
