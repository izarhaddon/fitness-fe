<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from 'date-fns'
import UILabel from '@/components/UILabel.vue'

const props = withDefaults(
  defineProps<{
    id: string
    time: Date
    name: string
    label: string
    format?: string
  }>(),
  {
    time: () => new Date(0),
  },
)

const timeInputFormated = computed(() => formatDate(
  props.time,
  'HH:mm',
))

const emits = defineEmits<{ (e: 'update:time', time: Date): void }>()

function changeDate(event: Event) {
  const target = event.target as HTMLInputElement

  const [
    hours,
    min,
  ] = target.value.split(':').map(item => Number(item))

  // 0 часов или 0 минут — валидное время, отсекаем только пустое/некорректное значение
  if (hours === undefined || min === undefined || Number.isNaN(hours) || Number.isNaN(min)) {
    return
  }

  const time = new Date(props.time)
  time.setHours(
    hours,
    min,
    0,
    0,
  )

  emits(
    'update:time',
    time,
  )
}
</script>

<template>
  <div class="ui-time-picker">
    <UILabel
      :id="id"
      :label="label"
    />
    <input
      :id="id"
      type="time"
      :name="name"
      :value="timeInputFormated"
      @change="changeDate"
    />
  </div>
</template>
