<script setup lang="ts">
import router from '@/router'

function changeRouter() {
  router.push({
    name: 'WorkoutCreate',
  })
}
</script>

<template>
  <button @click="changeRouter">AddWorkout</button>
</template>

<style scoped></style>
