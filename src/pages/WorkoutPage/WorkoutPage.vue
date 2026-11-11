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
import type { Workout } from '@/pages/WorkoutPage/types'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import WorkoutExerciseCard from '@/pages/WorkoutPage/components/WorkoutExerciseCard/WorkoutExerciseCard.vue'

const route = useRoute()

const workout = ref<Workout | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

const workoutId = computed(() => `${route.params.workoutId}`)
const title = computed(() => workout.value?.name ?? '')
const description = computed(() => workout.value?.description ?? '')

const fetchWorkout = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await unwrap(api.GET(
      '/workouts/{id}',
      {
        params: {
          path: {
            id: workoutId.value,
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
  <div class="workout-page">
    <h1 class="workout-page__title">workout-page</h1>
    <UIErrorMessage :message="error" />
    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div
      class="workout-page__cards-holder"
      v-if="workout"
    >
      <WorkoutExerciseCard
        v-for="(exercise, exerciseIndex) in workout.exercises"
        :key="exerciseIndex"
        :exercise="exercise"
      />
    </div>
    <div>
      <router-link :to="{ name: 'WorkoutEditPage', params: { workoutId } }">
        Редактировать
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workout-page__cards-holder {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
