// src/pages/ExerciseEditPage/ExerciseEditPage.vue

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
import ExerciseForm from '@/components/forms/ExerciseForm/ExerciseForm.vue'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import type { Exercise } from '@/pages/ExerciseEditPage/types'

const route = useRoute()

const exercise = ref<Exercise | undefined>(undefined)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

const fetchExercise = async () => {
  error.value = null

  const id = route.params.exerciseId as string

  if (!id) {
    isLoading.value = false
    return
  }

  try {
    const data = await unwrap(api.GET(
      '/exercises/{id}',
      {
        params: {
          path: {
            id,
          },
        },
      },
    ))

    exercise.value = data
  }
  catch (err) {
    error.value = getErrorMessage(
      err,
      'Не удалось загрузить упражнение',
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
    <UIErrorMessage :message="error" />
    <ExerciseForm
      v-if="exercise"
      :initial-data="exercise"
    />
  </div>
</template>

<style scoped></style>
