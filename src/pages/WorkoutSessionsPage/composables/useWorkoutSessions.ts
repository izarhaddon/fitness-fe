import { ref } from 'vue'
import {
  endOfDay,
  parseISO,
  startOfDay,
} from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import type { WorkoutSessionHistoryItem } from '@/pages/WorkoutSessionsPage/types'
import { api } from '@/utils/api.ts'
import {
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'

export const useWorkoutSessions = () => {
  const { user } = useAuthStore()

  const startDate = ref<Date>(startOfDay(new Date()))
  const endDate = ref<Date>(endOfDay(new Date()))

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
  const error = ref<string | null>(null)

  function formatLocalDateTime(dateOrString: Date | string, isEndOfDay = false): string {
    let date = typeof dateOrString === 'string' ? parseISO(dateOrString) : dateOrString
    if (typeof dateOrString === 'string' && isEndOfDay) {
      date = endOfDay(date)
    }

    // Границы дня берём в локальном времени пользователя и отправляем в UTC.
    // Раньше локальное время отправлялось с суффиксом Z (как будто это UTC) — фильтр съезжал на часовой пояс
    return date.toISOString()
  }

  async function getSessions() {
    if (!user) return

    error.value = null

    try {
      const query = {
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

      const data = await unwrap(api.GET(
        '/workout-sessions/history',
        {
          params: {
            query,
          },
        },
      ))

      sessions.value = data.data
    }
    catch (err) {
      error.value = getErrorMessage(
        err,
        'Не удалось загрузить историю тренировок',
      )
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
    error,
  }
}
