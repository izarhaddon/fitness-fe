// src/pages/WorkoutSessionPage/WorkoutSessionPage.vue

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
import type { WorkoutSessionHistoryItem } from '@/pages/WorkoutSessionPage/types'
import UIErrorMessage from '@/components/UIErrorMessage.vue'
import WorkoutSessionExercisesList from '@/pages/WorkoutSessionPage/components/WorkoutSessionExercisesList.vue'

const route = useRoute()
const workoutSession = ref<WorkoutSessionHistoryItem | null>(null)
const error = ref<string | null>(null)

const workoutSessionNotes = computed(() => workoutSession.value?.notes)

async function getWorkoutSessionById() {
  error.value = null

  try {
    const workoutSessionId = route.params.workoutSessionId as string
    if (workoutSessionId) {
      const data = await unwrap(api.GET(
        '/workout-sessions/{id}',
        {
          params: {
            path: {
              id: workoutSessionId,
            },
          },
        },
      ))

      workoutSession.value = data
    }
  }
  catch (err) {
    error.value = getErrorMessage(
      err,
      'Не удалось загрузить тренировку',
    )
  }
}

onMounted(() => {
  getWorkoutSessionById()
})
</script>

<template>
  <div class="workout-session-page">
    <h1 class="workout-session-page__notes">{{ workoutSessionNotes }}</h1>
    <UIErrorMessage :message="error" />
    <WorkoutSessionExercisesList
      v-if="workoutSession"
      :exercises="workoutSession.exercises"
    />
  </div>
</template>

<style scoped lang="scss">
.workout-session-page {
  &__notes {
    margin-bottom: 16px;
  }
}
</style>
