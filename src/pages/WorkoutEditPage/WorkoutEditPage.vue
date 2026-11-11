// src/pages/WorkoutEditPage/WorkoutEditPage.vue

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/utils/api'
import {
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'
import WorkoutForm from '@/components/forms/WorkoutForm/WorkoutForm.vue'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import type { Workout } from '@/pages/WorkoutEditPage/types'

const route = useRoute()

const workout = ref<Workout | undefined>(undefined)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

const fetchWorkout = async () => {
  error.value = null

  const id = route.params.workoutId as string

  if (!id) {
    isLoading.value = false
    return
  }

  try {
    const data = await unwrap(api.GET(
      '/workouts/{id}',
      {
        params: {
          path: {
            id,
          },
        },
      },
    ))

    workout.value = data
  }
  catch (err) {
    error.value = getErrorMessage(
      err,
      'Не удалось загрузить тренировку',
    )
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchWorkout()
})
</script>

<template>
  <div class="workout-edit-page">
    <h1 class="workout-edit-page__title">workout-page</h1>
    <UIErrorMessage :message="error" />
    <WorkoutForm
      v-if="workout"
      v-model:initial-data="workout"
    />
  </div>
</template>

<style scoped></style>
