<script setup lang="ts">
import router from '@/router'
import type { Exercise } from '@/pages/ExercisesPage/components/ExerciseTable/types'

const exercises = defineModel<Exercise[]>(
  'exercises',
  {
    default: () => [],
  },
)

const navigateToEdit = (id: string) => {
  router.push(`/exercises/${id}`)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Название</th>
        <th>Описание</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="exercise in exercises"
        :key="exercise.id"
        @click="navigateToEdit(exercise.id)"
      >
        <td>
          {{ exercise.name }}
        </td>
        <td>
          {{ exercise.description || '—' }}
        </td>
        <td>
          {{ exercise.isActive ? 'Активно' : 'Неактивно' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
