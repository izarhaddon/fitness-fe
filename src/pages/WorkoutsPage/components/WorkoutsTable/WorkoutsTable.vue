<script setup lang="ts">
import router from '@/router'
import type { Workout } from '@/pages/WorkoutsPage/components/WorkoutsTable/types'

const workouts = defineModel<Workout[]>(
  'workouts',
  {
    default: () => [],
  },
)

const navigateToEdit = (id: string) => {
  router.push(`/workouts/${id}`)
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
        v-for="workout in workouts"
        :key="workout.id"
        @click="navigateToEdit(workout.id)"
      >
        <td>
          {{ workout.name }}
        </td>
        <td>
          {{ workout.description || '—' }}
        </td>
        <td>
          {{ workout.isActive ? 'Активно' : 'Неактивно' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
