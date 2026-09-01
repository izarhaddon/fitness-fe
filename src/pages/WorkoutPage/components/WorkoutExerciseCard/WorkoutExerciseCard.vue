<script setup lang="ts">
import type { WorkoutExercise } from '@/pages/WorkoutPage/components/WorkoutExerciseCard/types'

defineProps<{
  exercise: WorkoutExercise
}>()
</script>

<template>
  <div class="workout-exercise-card">
    <p>{{ exercise.exercise.name }}</p>
    <p>{{ exercise.exercise.description }}</p>
    <p>{{ exercise.sets }}</p>
    <p>{{ exercise.repetitions }}</p>
    <p>{{ exercise.weight }}</p>
  </div>
</template>

<style lang="scss" scoped>
.workout-exercise-card {
  --color-border: black;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}
</style>
