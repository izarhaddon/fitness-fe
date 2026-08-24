<!-- src/components/forms/WorkoutForm/WorkoutForm.vue -->

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkoutForm } from '@/components/forms/WorkoutForm/composables/useWorkoutForm'
import WorkoutFormExercisesTables from '@/components/forms/WorkoutForm/components/WorkoutFormExercisesTables.vue'

const route = useRoute()

const {
  form, onSubmit, getWorkoutById, isLoading, error,
} = useWorkoutForm()

onMounted(() => {
  const workoutId = route.params.workoutId ? route.params.workoutId.toString() : undefined
  if (workoutId) {
    getWorkoutById(workoutId)
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div
      v-if="error"
      style="color: red; margin-bottom: 1rem"
    >
      {{ error }}
    </div>

    <div>
      <label for="name">Название тренировки</label>
      <input
        id="name"
        v-model="form.name"
        name="name"
        type="text"
        required
        :disabled="isLoading"
      />
    </div>

    <div>
      <label for="description">Описание</label>
      <textarea
        id="description"
        v-model="form.description"
        name="description"
        rows="4"
        :disabled="isLoading"
      />
    </div>

    <!-- Передаем массив упражнений формы -->
    <WorkoutFormExercisesTables v-model:exercises="form.exercises" />

    <div style="margin-top: 1rem">
      <button
        type="submit"
        :disabled="!form.name || isLoading"
      >
        {{ isLoading ? 'Сохранение...' : 'Сохранить тренировку' }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
