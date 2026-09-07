// src/pages/WorkoutSessionCreatePage/components/WorkoutSessionForm.vue
<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'

import UIButton from '@/components/UIButton.vue'
import UIDatePicker from '@/components/UIDatePicker.vue'
import UISelect from '@/components/UISelect.vue'
import UITimePicker from '@/components/UITimePicker.vue'
import { RouterNames } from '@/router/types'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/api.ts'

import type { Workout } from '@/pages/WorkoutsPage/types'
import UITextArea from '@/components/UITextArea.vue'

const router = useRouter()
const { user } = useAuthStore()

const date = ref<Date>(new Date())
const time = ref<Date>(new Date())
const workouts = ref<Workout[]>([])
const workoutId = ref<string>('')
const notes = ref<string>('')

async function getWorkouts() {
  try {
    const response = await api.GET(
      '/workouts',
      {
        params: {
          query: {
            limit: 100,
          },
        },
      },
    )
    if (response.data) {
      workouts.value = response.data.data
    }
  }
  catch (err) {
    console.error(err)
  }
}

async function onSubmit() {
  if (!user) {
    return
  }

  const year = date.value.getFullYear()
  const month = date.value.getMonth()
  const day = date.value.getDate()

  const hours = time.value.getHours()
  const minutes = time.value.getMinutes()

  const dateObj = new Date(
    year,
    month,
    day,
    hours,
    minutes,
    0,
    0,
  )

  if (Number.isNaN(dateObj.getTime())) {
    console.error('Некорректная дата или время')
    return
  }

  const scheduledAt = dateObj.toISOString()

  try {
    await api.POST(
      '/workout-sessions',
      {
        body: {
          workoutId: workoutId.value,
          userId: user.id,
          scheduledAt,
          status: 'PLANNED',
          notes: notes.value,
        },
      },
    )

    router.push({
      name: RouterNames.WorkoutSessionsPage,
    })
  }
  catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getWorkouts()
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UIDatePicker
      id="date"
      name="date"
      label="Дата"
      v-model:date="date"
    />
    <UITimePicker
      id="time"
      name="time"
      label="Время"
      v-model:time="time"
    />
    <UISelect
      id="workout"
      name="workout"
      label="Тренировка"
      v-model:selected="workoutId"
      :options="workouts.map((item) => ({ value: item.id, label: item.name }))"
    />
    <UITextArea
      id="notes"
      label="Описание"
      name="notes"
      v-model:value="notes"
    />
    <div>
      <UIButton type="submit">Создать</UIButton>
    </div>
  </form>
</template>
