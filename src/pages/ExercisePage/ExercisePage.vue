// src/pages/ExercisePage/ExercisePage.vue
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/utils/api'
import type { Exercise } from '@/pages/ExercisePage/types'

const route = useRoute()

const exercise = ref<Exercise | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

const exerciseId = computed(() => `${route.params.exerciseId}`)
const title = computed(() => exercise.value?.name ?? '')
const description = computed(() => exercise.value?.description ?? '')

const fetchExercise = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.GET(
      '/exercises/{id}',
      {
        params: {
          path: {
            id: exerciseId.value,
          },
        },
      },
    )

    if (!response.data) {
      error.value = 'Не удалось загрузить упражнение'
      return
    }

    exercise.value = response.data
  }
  catch {
    error.value = 'Произошла ошибка сети при загрузке данных'
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
  <div class="exercise-page">
    <h1 class="exercise-page__title">exercise-page</h1>
    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div>
      <router-link :to="{ name: 'ExerciseEditPage', params: { exerciseId } }">
        Редактировать
      </router-link>
    </div>
  </div>
</template>
