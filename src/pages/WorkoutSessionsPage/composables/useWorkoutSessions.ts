import { ref } from 'vue'
import {
  endOfDay,
  format,
  parseISO,
  startOfDay,
} from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import type { WorkoutSessionHistoryItem } from '@/pages/WorkoutSessionsPage/types'
import { useRouter } from 'vue-router'
import { api } from '@/utils/api.ts'

export const useWorkoutSessions = () => {
  const { user } = useAuthStore()

  const startDate = ref<Date>(startOfDay(new Date()))
  const endDate = ref<Date>(endOfDay(new Date()))

  const router = useRouter()

  const options = [
    {
      label: 'ALL',
      value: 'ALL',
    },
    {
      label: 'PLANNED',
      value: 'PLANNED',
    },
    {
      label: 'COMPLETED',
      value: 'COMPLETED',
    },
    {
      label: 'SKIPPED',
      value: 'SKIPPED',
    },
  ]
  const status = ref<'ALL' | 'PLANNED' | 'COMPLETED' | 'SKIPPED'>('ALL')
  const sessions = ref<WorkoutSessionHistoryItem[]>([])

  function formatLocalDateTime(dateOrString: Date | string, isEndOfDay = false): string {
    let date = typeof dateOrString === 'string' ? parseISO(dateOrString) : dateOrString
    if (typeof dateOrString === 'string' && isEndOfDay) {
      date = endOfDay(date)
    }

    return format(
      date,
      `yyyy-MM-dd\'T\'HH:mm:ss\'Z\'`,
    )
  }

  async function getSessions() {
    if (!user) return

    try {
      const query = {
        userId: user.id,
        startDate: formatLocalDateTime(
          startDate.value,
          false,
        ),
        endDate: formatLocalDateTime(
          endDate.value,
          true,
        ),
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

  function onSubmit() {
    getSessions()
  }

  return {
    status,
    startDate,
    endDate,
    sessions,
    options,
    onSubmit,
    getSessions,
  }
}
