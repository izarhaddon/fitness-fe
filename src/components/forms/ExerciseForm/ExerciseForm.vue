<script setup lang="ts">
import { useExerciseForm } from './useExerciseForm.ts'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
const route = useRoute()
const exerciseForm = useExerciseForm()
const { form, getExerciseById, onSubmit } = exerciseForm

onMounted(() => {
  const exerciseId = route.params.exerciseId ? Number(route.params.exerciseId) : undefined
  if (exerciseId) {
    getExerciseById(exerciseId)
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="name">name</label>
    <input id="name" v-model="form.name" name="name" type="text" />
    <label for="description">Description</label>
    <textarea id="description" v-model="form.description" name="description" type="text" />
    <label for="repetitions">repetitions</label>
    <input id="repetitions" name="repetitions" type="number" />
    <label for="sets">sets</label>
    <input id="sets" name="sets" type="number" />
    <label for="weight">weight</label>
    <input id="weight" name="weight" type="number" />
    <button type="submit">Submit</button>
  </form>
</template>

<style scoped></style>
