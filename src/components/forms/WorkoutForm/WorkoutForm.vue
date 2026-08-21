<script setup lang="ts">
import { useWorkoutForm } from '@/components/forms/WorkoutForm/composables/useWorkoutForm.tsx'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const {
  form, onSubmit, getWorkoutById,
} = useWorkoutForm()

onMounted(() => {
  const workoutId = route.params.workoutId ? Number(route.params.workoutId) : undefined
  if (workoutId) {
    getWorkoutById(workoutId)
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="name">name</label>
      <input
        id="name"
        v-model="form.name"
        name="name"
        type="text"
        required
      />
    </div>

    <div>
      <label for="description">description</label>
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
        submit
      </button>
    </div>
  </form>
</template>

<style scoped></style>
