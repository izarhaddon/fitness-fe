// src/pages/WorkoutSessionPage/components/WorkoutSessionExercisesList.vue

<script setup lang="ts">
import type { SessionExercise } from '@/pages/WorkoutSessionPage/types'
import WorkoutSessionExercise from '@/pages/WorkoutSessionPage/components/WorkoutSessionExercise.vue'

defineProps<{ exercises: SessionExercise[] }>()
</script>

<template>
  <div class="workout-session-exercises-list">
    <WorkoutSessionExercise
      v-for="(exercise, exerciseIndex) in exercises"
      :key="exerciseIndex"
      :sets="exercise.sets"
      :session-id="exercise.id"
      :order="exercise.order"
      :notes="exercise.notes"
      :exercise-id="exercise.id"
      :exercise="exercise.exercise"
      :id="exercise.id"
    />
  </div>
</template>

<style scoped></style>
