<script setup lang="ts">
import { useExerciseForm } from './useExerciseForm.ts'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
const route = useRoute()
const exerciseForm = useExerciseForm()
const {
  form, getExerciseById, onSubmit,
} = exerciseForm

onMounted(() => {
  const exerciseId = route.params.exerciseId ? Number(route.params.exerciseId) : undefined
  if (exerciseId) {
    getExerciseById(exerciseId)
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
      <label for="repetitions">Repetitions</label>
      <input
        id="repetitions"
        v-model.number="form.repetitions"
        name="repetitions"
        type="number"
        min="0"
      />
    </div>

    <div>
      <label for="sets">Sets</label>
      <input
        id="sets"
        v-model.number="form.sets"
        name="sets"
        type="number"
        min="0"
      />
    </div>

    <div>
      <label for="weight">Weight (kg)</label>
      <input
        id="weight"
        v-model.number="form.weight"
        name="weight"
        type="number"
        min="0"
        step="0.1"
      />
    </div>

    <div>
      <button
        type="submit"
        :disabled="!form.name"
      >
        {{ route.params.exerciseId ? 'Update Exercise' : 'Create Exercise' }}
      </button>
      <router-link :to="{ name: 'AdminExercises' }"> Cancel </router-link>
    </div>
  </form>
</template>

<style scoped></style>
