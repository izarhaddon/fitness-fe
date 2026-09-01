// src/pages/WorkoutSessionCreatePage/WorkoutSessionCreatePage.vue

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'
import UIButton from '@/components/UIButton.vue'
import type { Workout } from '@/pages/WorkoutsPage/types'
import { useAuthStore } from '@/stores/auth'

const { user } = useAuthStore()

const date = ref<Date>(new Date())
const time = ref<Date>(new Date())
const workouts = ref<Workout[]>([])
const workoutId = ref<string>('')

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
  finally {
  }
}

async function onSubmit() {
  if (user) {
    const [
      year,
      month,
      day,
    ] = `${date.value}`.split('-')
    const [
      hours,
      minutes,
    ] = `${time.value}`.split(':')

    const dateObj = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      0, // секунды
      0, // миллисекунды
    )

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
            notes: 'Планирую легкую тренировку',
          },
        },
      )
    }
    catch (err) {
      console.error(err)
    }
  }
}

onMounted(() => {
  getWorkouts()
})
</script>

<template>
  <div class="calender-create-page">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="date">Дата</label>
        <input
          id="date"
          name="date"
          type="date"
          v-model="date"
        />
      </div>
      <div>
        <label for="time">Время</label>
        <input
          id="time"
          name="time"
          type="time"
          v-model="time"
        />
      </div>
      <div>
        <label for="workout">Тренировка</label>
        <select
          id="workout"
          name="workout"
          v-model="workoutId"
        >
          <option
            value=""
            disabled
          >
            Выберите тренировку
          </option>
          <option
            v-for="(workout, workoutIndex) in workouts"
            :key="workoutIndex"
            :value="workout.id"
          >
            {{ workout.name }}
          </option>
        </select>
      </div>
      <div>
        <UIButton type="submit"> submit </UIButton>
      </div>
    </form>
  </div>
</template>
