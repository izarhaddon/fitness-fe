<!-- src/components/forms/WorkoutForm/components/WorkoutFormExercisesTables.vue -->

<script setup lang="ts">
// Импортируем тип формы, а не тип ответа API!
import type { WorkoutExerciseForm } from '../composables/useWorkoutForm'

const exercises = defineModel<WorkoutExerciseForm[]>(
  'exercises',
  {
    default: () => [],
  },
)
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Порядок</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Подходы</th>
          <th>Повторения</th>
          <th>Вес</th>
        </tr>
      </thead>
      <tbody>
        <!-- Исправлен деструктурирующий v-for под тип WorkoutExerciseForm -->
        <tr
          v-for="(ex, index) in exercises"
          :key="ex.exerciseId || index"
        >
          <td>{{ ex.order }}</td>
          <td>{{ ex.name || 'Неизвестное упражнение' }}</td>
          <td>{{ ex.exerciseId }}</td>
          <!-- Здесь можно вывести ID или добавить селект -->
          <td>
            <input
              v-model="ex.sets"
              type="number"
            />
          </td>
          <td><input v-model="ex.repetitions" /></td>
          <td><input v-model="ex.weight" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
