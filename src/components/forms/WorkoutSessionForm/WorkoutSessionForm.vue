// src/components/forms/WorkoutSessionForm/WorkoutSessionForm.vue

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'

import UIButton from '@/components/UIButton.vue'
import UIDatePicker from '@/components/UIDatePicker.vue'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import UISelect from '@/components/UISelect.vue'
import UITextArea from '@/components/UITextArea.vue'
import UITimePicker from '@/components/UITimePicker.vue'
import { RouterNames } from '@/router/types'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/api.ts'
import {
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'

import type { Workout } from '@/pages/WorkoutsPage/types'

const router = useRouter()
const { user } = useAuthStore()

const date = ref<Date>(new Date())
const time = ref<Date>(new Date())
const workouts = ref<Workout[]>([])
const workoutId = ref<string>('')
const notes = ref<string>('')
const formError = ref<string | null>(null)

const dateTime = computed(() => {
  const year = date.value.getFullYear()
  const month = date.value.getMonth()
  const day = date.value.getDate()

  const hours = time.value.getHours()
  const minutes = time.value.getMinutes()

  return new Date(
    year,
    month,
    day,
    hours,
    minutes,
    0,
    0,
  )
})

async function getWorkouts() {
  formError.value = null

  try {
    const data = await unwrap(api.GET(
      '/workouts',
      {
        params: {
          query: {
            limit: 100,
          },
        },
      },
    ))

    workouts.value = data.data
  }
  catch (err) {
    formError.value = getErrorMessage(
      err,
      'Не удалось загрузить список тренировок',
    )
  }
}

async function onSubmit() {
  formError.value = null

  if (!user) {
    return
  }

  if (Number.isNaN(dateTime.value.getTime())) {
    formError.value = 'Некорректная дата или время'
    return
  }

  const scheduledAt = dateTime.value.toISOString()

  try {
    await unwrap(api.POST(
      '/workout-sessions',
      {
        body: {
          workoutId: workoutId.value,
          scheduledAt,
          status: 'PLANNED',
          notes: notes.value,
        },
      },
    ))

    router.push({
      name: RouterNames.WorkoutSessionsPage,
    })
  }
  catch (err) {
    formError.value = getErrorMessage(
      err,
      'Ошибка при создании сессии тренировки',
    )
  }
}

onMounted(() => {
  getWorkouts()
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UIErrorMessage :message="formError" />

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
