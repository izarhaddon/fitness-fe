<script setup lang="ts">
import { RouterNames } from '@/router/types'
</script>

<template>
  <nav class="navigation-component">
    <RouterLink :to="{ name: RouterNames.ExercisesPage }">Exercises</RouterLink>
    <RouterLink :to="{ name: RouterNames.WorkoutsPage }">Workouts</RouterLink>
    <RouterLink :to="{ name: RouterNames.WorkoutSessionsPage }">Workout Sessions</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.navigation-component {
  display: flex;
  gap: 8px;
}
</style>
