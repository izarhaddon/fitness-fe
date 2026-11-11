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

  if (hours && min) {
    const time = new Date()
      .setHours(
        hours,
        min,
      )

    emits(
      'update:time',
      new Date(time),
    )
  }
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
