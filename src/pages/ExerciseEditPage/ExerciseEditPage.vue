// src/pages/ExerciseEditPage/ExerciseEditPage.vue

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/utils/api'
import ExerciseForm from '@/components/forms/ExerciseForm/ExerciseForm.vue'
import type { Exercise } from '@/pages/ExerciseEditPage/types'

const route = useRoute()

const exercise = ref<Exercise | undefined>(undefined)
const isLoading = ref<boolean>(true)

const fetchExercise = async () => {
  const id = route.params.exerciseId as string

  if (!id) {
    isLoading.value = false
    return
  }

  try {
    const response = await api.GET(
      '/exercises/{id}',
      {
        params: {
          path: {
            id,
          },
        },
      },
    )

    if (response.data) {
      exercise.value = response.data
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
  fetchExercise()
})
</script>

<template>
  <div class="exercise-edit-page">
    <h1 class="exercise-edit-page__title">exercise-edit-page</h1>
    <ExerciseForm
      v-if="exercise"
      :initial-data="exercise"
    />
  </div>
</template>

<style scoped></style>
