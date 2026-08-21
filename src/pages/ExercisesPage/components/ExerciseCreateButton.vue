<script setup lang="ts">
import router from '@/router'

function changeRouter() {
  router.push({
    name: 'ExerciseCreatePage',
  })
}
</script>

<template>
  <button @click="changeRouter">AddExercise</button>
</template>

<style scoped></style>
