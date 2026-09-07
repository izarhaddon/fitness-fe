<script setup lang="ts">
import { RouterNames } from '@/router/types'
import { useRouter } from 'vue-router'
import type { WorkoutSessionHistoryItem } from '@/pages/WorkoutSessionsPage/types'

const router = useRouter()

defineProps<{
  workoutSession: WorkoutSessionHistoryItem
}>()

function changeRoute(workoutSessionId: string) {
  router.push({
    name: RouterNames.WorkoutSessionPage,
    params: {
      workoutSessionId,
    },
  })
}
</script>

<template>
  <div
    class="workout-session-card"
    @click="changeRoute(workoutSession.id)"
  >
    {{ workoutSession.notes }}
    <div>
      <span
        v-for="workout in workoutSession.exercises"
        :key="workout.id"
      >{{
        workout.exercise.name
      }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.workout-session-card {
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e4e4e4;
}
</style>
