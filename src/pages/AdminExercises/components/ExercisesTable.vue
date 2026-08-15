<script setup lang="ts">
import { useAdminExercisesPage } from '@/pages/AdminExercises/composables/useAdminExercises.ts'
const adminExercises = useAdminExercisesPage()
const { table } = adminExercises
</script>

<template>
  <div>
    <table>
      <thead>
      <tr>
        <td>name</td>
        <td>description</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in table" :key="row.id">
        <td>{{ row.name }}</td>
        <td>{{ row.description }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>
