// src/pages/ExercisesPage/ExercisesPage.vue

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { api } from '@/utils/api'
import {
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'
import { useAuthStore } from '@/stores/auth'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import type { Exercise } from '@/pages/ExercisesPage/types'
import ExercisesTable from '@/pages/ExercisesPage/components/ExerciseTable/ExercisesTable.vue'

const authStore = useAuthStore()

const exercises = ref<Exercise[]>([])
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

const fetchExercises = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await unwrap(api.GET(
      '/exercises',
      {
        params: {
          query: {
            limit: 100,
          },
        },
      },
    ))

    exercises.value = data.data
  }
  catch (err) {
    error.value = getErrorMessage(
      err,
      'Не удалось загрузить список упражнений',
    )
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchExercises()
})
</script>

<template>
  <div class="exercises-page">
    <h1 class="exercises-page__title">Справочник упражнений</h1>

    <div v-if="authStore.isAdmin">
      <router-link :to="{ name: 'ExerciseCreatePage' }"> Создать новое упражнение </router-link>
    </div>

    <UIErrorMessage :message="error" />

    <ExercisesTable
      v-if="!isLoading && !error"
      v-model:exercises="exercises"
    />
  </div>
</template>

<style scoped></style>
