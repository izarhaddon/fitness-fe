<script setup lang="ts"></script>

<template>
  <RouterLink :to="{ name: 'LoginPage' }">Login</RouterLink>
  <RouterLink :to="{ name: 'RegistrationPage' }">Registration</RouterLink>
  <RouterLink :to="{ name: 'ExercisesPage' }">Exercises</RouterLink>
  <RouterLink :to="{ name: 'WorkoutsPage' }">Workouts</RouterLink>
</template>

<style scoped></style>
