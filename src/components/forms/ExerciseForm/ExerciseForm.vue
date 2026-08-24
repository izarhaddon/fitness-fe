<script setup lang="ts">
import { useExerciseForm } from './useExerciseForm.ts'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
const route = useRoute()
const {
  form, getExerciseById, onSubmit,
} = useExerciseForm()

onMounted(() => {
  const exerciseId = route.params.exerciseId
  if (exerciseId) {
    getExerciseById(`${exerciseId}`)
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="name">Name</label>
      <input
        id="name"
        v-model="form.name"
        name="name"
        type="text"
        required
      />
    </div>

    <div>
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        name="description"
        rows="4"
      />
    </div>

    <div>
      <button
        type="submit"
        :disabled="!form.name"
      >
        {{ route.params.exerciseId ? 'Update Exercise' : 'Create Exercise' }}
      </button>
      <router-link :to="{ name: 'ExercisesPage' }"> Cancel </router-link>
    </div>
  </form>
</template>

<style scoped></style>
