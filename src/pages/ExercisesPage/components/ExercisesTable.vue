<script setup lang="ts">
import { useAdminExercisesPage } from '@/pages/Exercises/composables/useExercises.ts'
import { useRouter } from 'vue-router'
const {
  table, getTable,
} = useAdminExercisesPage()
const router = useRouter()

getTable()

function changeRouter(exerciseId: number | undefined) {
  router.push({
    name: 'Exercise',
    params: {
      exerciseId,
    },
  })
}
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
        <tr
          v-for="row in table"
          :key="row.id"
          @click="changeRouter(row.id)"
        >
          <td>
            {{ row.name }}
          </td>
          <td>
            {{ row.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
