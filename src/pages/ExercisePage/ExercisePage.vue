// src/pages/ExercisePage/ExercisePage.vue
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/utils/api'
import {
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'
import { useAuthStore } from '@/stores/auth'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import type { Exercise } from '@/pages/ExercisePage/types'

const route = useRoute()
const authStore = useAuthStore()

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
    const data = await unwrap(api.GET(
      '/exercises/{id}',
      {
        params: {
          path: {
            id: exerciseId.value,
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
  <div class="exercise-page">
    <h1 class="exercise-page__title">exercise-page</h1>
    <UIErrorMessage :message="error" />
    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div v-if="authStore.isAdmin">
      <router-link :to="{ name: 'ExerciseEditPage', params: { exerciseId } }">
        Редактировать
      </router-link>
    </div>
  </div>
</template>
