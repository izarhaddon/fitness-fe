<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/api.ts'
import UIButton from '@/components/UIButton.vue'
import type { WorkoutSessionHistoryItem } from '@/pages/WorkoutSessionsPage/types'

const { user } = useAuthStore()

const startDate = ref<Date>(new Date())
const endDate = ref<Date>(new Date())
const status = ref<'ALL' | 'PLANNED' | 'COMPLETED' | 'SKIPPED' | undefined>('ALL')
const sessions = ref<WorkoutSessionHistoryItem[]>([])

async function getSessions() {
  if (user) {
    try {
      const query = {
        userId: user.id,
        startDate: new Date(startDate.value).toISOString(),
        endDate: new Date(endDate.value).toISOString(),
        status: status.value === 'ALL' ? undefined : status.value,
      }

      const response = await api.GET(
        '/workout-sessions/history',
        {
          params: {
            query,
          },
        },
      )
      if (response.data) {
        sessions.value = response.data.data
      }
    }
    catch (err) {
      console.error(err)
    }
  }
}

function onSubmit() {
  getSessions()
}

onMounted(() => {
  getSessions()
})
</script>

<template>
  <div class="workout-sessions-page">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="startDate">startDate</label>
        <input
          id="startDate"
          type="date"
          name="startDate"
          v-model="startDate"
        />
      </div>

      <div>
        <label for="endDate">endDate</label>
        <input
          id="endDate"
          type="date"
          name="endDate"
          v-model="endDate"
        />
      </div>

      <div>
        <select
          id="status"
          name="status"
          v-model="status"
        >
          <option value="ALL">ALL</option>
          <option value="PLANNED">PLANNED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="SKIPPED">SKIPPED</option>
        </select>
      </div>

      <div>
        <UIButton type="submit">submit</UIButton>
      </div>
    </form>

    <div
      v-for="session in sessions"
      :key="session.id"
    >
      {{ session }}
    </div>
  </div>
</template>

<style scoped></style>
