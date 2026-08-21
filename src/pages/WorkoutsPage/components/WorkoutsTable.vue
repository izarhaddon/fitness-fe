<script setup lang="ts">
import useWorkouts from '@/pages/WorkoutsPage/composables/useWorkouts.ts'
import router from '@/router'

const {
  table, getWorkouts,
} = useWorkouts()

getWorkouts()

function changeRouter(workoutId: number | undefined) {
  router.push({
    name: 'Workout',
    params: {
      workoutId,
    },
  })
}
</script>

<template>
  WorkoutsTable
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in table"
        :key="row.id"
        @click="changeRouter(row.id)"
      >
        <td>{{ row.name }}</td>
        <td>{{ row.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
