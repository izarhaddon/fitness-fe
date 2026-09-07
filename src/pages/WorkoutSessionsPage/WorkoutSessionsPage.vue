<script setup lang="ts">
import UIButton from '@/components/UIButton.vue'
import WorkoutSessionsPageEmpty from '@/pages/WorkoutSessionsPage/components/WorkoutSessionsPageEmpty.vue'
import { useWorkoutSessions } from '@/pages/WorkoutSessionsPage/composables/useWorkoutSessions.ts'
import { onMounted } from 'vue'
import { RouterNames } from '@/router/types'
import UIDatePicker from '@/components/UIDatePicker.vue'
import UISelect from '@/components/UISelect.vue'
import WorkoutSessionCard from '@/pages/WorkoutSessionsPage/components/WorkoutSessionCard.vue'

const {
  endDate, startDate, status, sessions, options, onSubmit, getSessions,
}
  = useWorkoutSessions()

onMounted(() => {
  getSessions()
})
</script>

<template>
  <div class="workout-sessions-page">
    <form @submit.prevent="onSubmit">
      <UIDatePicker
        id="startDate"
        v-model:date="startDate"
        name="startDate"
        label="startDate"
      />

      <UIDatePicker
        id="endDate"
        v-model:date="endDate"
        name="endDate"
        label="endDate"
      />

      <UISelect
        id="status"
        name="status"
        label="status"
        v-model:selected="status"
        :options="options"
      />

      <div>
        <UIButton type="submit">submit</UIButton>
      </div>
    </form>

    <div class="workout-sessions-page__cards-wrapper">
      <WorkoutSessionCard
        v-for="workoutSession in sessions"
        :key="workoutSession.id"
        :workoutSession="workoutSession"
      />
    </div>

    <WorkoutSessionsPageEmpty v-if="sessions.length === 0" />

    <router-link :to="{ name: RouterNames.WorkoutSessionCreatePage }">Добавить</router-link>
  </div>
</template>

<style scoped lang="scss">
.workout-sessions-page {
  &__cards-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
