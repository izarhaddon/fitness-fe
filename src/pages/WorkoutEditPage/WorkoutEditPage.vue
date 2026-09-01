// src/pages/WorkoutEditPage/WorkoutEditPage.vue

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/utils/api'
import WorkoutForm from '@/components/forms/WorkoutForm/WorkoutForm.vue'
import type { Workout } from '@/pages/WorkoutEditPage/types'

const route = useRoute()

const workout = ref<Workout | undefined>(undefined)
const isLoading = ref<boolean>(true)

const fetchWorkout = async () => {
  const id = route.params.workoutId as string

  if (!id) {
    isLoading.value = false
    return
  }

  try {
    const response = await api.GET(
      '/workouts/{id}',
      {
        params: {
          path: {
            id,
          },
        },
      },
    )

    if (response.data) {
      workout.value = response.data
    }
  }
  catch (error) {
    console.error(
      'Ошибка при загрузке упражнения:',
      error,
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
    <WorkoutForm
      v-if="workout"
      v-model:initial-data="workout"
    />
  </div>
</template>

<style scoped></style>
