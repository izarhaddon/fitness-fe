// src/pages/WorkoutsPage/WorkoutsPage.vue
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
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import WorkoutsTable from '@/pages/WorkoutsPage/components/WorkoutsTable/WorkoutsTable.vue'

import type { Workout } from '@/pages/WorkoutsPage/types'

const workouts = ref<Workout[]>([])
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

const fetchWorkouts = async () => {
  isLoading.value = true
  error.value = null

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
    error.value = getErrorMessage(
      err,
      'Не удалось загрузить список тренировок',
    )
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchWorkouts()
})
</script>

<template>
  <div class="workouts-page">
    <h1 class="workouts-page__title">Тренировки</h1>
    <UIErrorMessage :message="error" />
    <div>
      <router-link :to="{ name: 'WorkoutCreatePage' }"> Создать новую тренировку </router-link>
    </div>

    <WorkoutsTable
      v-if="!isLoading && !error"
      v-model:workouts="workouts"
    />
  </div>
</template>

<style scoped></style>
