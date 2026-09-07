<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from 'date-fns'
import UILabel from '@/components/UILabel.vue'

const props = withDefaults(
  defineProps<{
    id: string
    date: Date
    name: string
    label: string
  }>(),
  {
    date: () => new Date(),
  },
)

const dateInputFormated = computed(() => formatDate(
  props.date,
  'yyyy-MM-dd',
))

const emits = defineEmits<{ (e: 'update:date', date: Date): void }>()

function changeDate(event: Event) {
  const target = event.target as HTMLInputElement
  emits(
    'update:date',
    new Date(target.value),
  )
}
</script>

<template>
  <div>
    <UILabel
      :id="id"
      :label="label"
    />
    <input
      :id="id"
      type="date"
      :name="name"
      :value="dateInputFormated"
      @change="changeDate"
    />
  </div>
</template>

<style scoped></style>
