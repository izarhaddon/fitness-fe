// src/pages/ExercisesPage/ExercisesPage.vue

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { api } from '@/utils/api'
import type { Exercise } from '@/pages/ExercisesPage/types'
import ExercisesTable from '@/pages/ExercisesPage/components/ExerciseTable/ExercisesTable.vue'

const exercises = ref<Exercise[]>([])
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

const fetchExercises = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.GET(
      '/exercises',
      {
        params: {
          query: {
            limit: 100,
          },
        },
      },
    )

    if (!response.data) {
      error.value = 'Не удалось загрузить список упражнений'
      return
    }

    exercises.value = response.data.data
  }
  catch {
    error.value = 'Произошла ошибка сети при загрузке данных'
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

    <div>
      <router-link :to="{ name: 'ExerciseCreatePage' }"> Создать новое упражнение </router-link>
    </div>

    <ExercisesTable
      v-if="!isLoading && !error"
      v-model:exercises="exercises"
    />
  </div>
</template>

<style scoped></style>
