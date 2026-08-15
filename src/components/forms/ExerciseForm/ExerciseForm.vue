<script setup lang="ts">
import { useExerciseForm } from './useExerciseForm.ts'
const exerciseForm = useExerciseForm();
const { form, onSubmit } = exerciseForm
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="name">name</label>
    <input
      id="name"
      v-model="form.name"
      name="name"
      type="text"
    />
    <label for="description">Description</label>
    <textarea
      id="description"
      v-model="form.description"
      name="description"
      type="text"
    />
    <button type="submit">
      Submit
    </button>
  </form>
</template>

<style scoped>

</style>
