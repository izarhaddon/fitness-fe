// src/pages/WorkoutSessionPage/WorkoutSessionPage.vue

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/utils/api'
import type { WorkoutSessionHistoryItem } from '@/pages/WorkoutSessionPage/types'
import WorkoutSessionExercisesList from '@/pages/WorkoutSessionPage/components/WorkoutSessionExercisesList.vue'

const route = useRoute()
const workoutSession = ref<WorkoutSessionHistoryItem | null>(null)

const workoutSessionNotes = computed(() => workoutSession.value?.notes)

async function getWorkoutSessionById() {
  try {
    const workoutSessionId = route.params.workoutSessionId as string
    if (workoutSessionId) {
      const response = await api.GET(
        `/workout-sessions/{id}`,
        {
          params: {
            path: {
              id: workoutSessionId,
            },
          },
        },
      )

      if (response.data) {
        workoutSession.value = response.data
      }
    }
  }
  catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getWorkoutSessionById()
})
</script>

<template>
  <div class="workout-session-page">
    <h1 class="workout-session-page__notes">{{ workoutSessionNotes }}</h1>
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
