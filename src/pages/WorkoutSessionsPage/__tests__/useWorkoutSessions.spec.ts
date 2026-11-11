// src/pages/WorkoutSessionsPage/__tests__/useWorkoutSessions.spec.ts

import {
  endOfDay,
  startOfDay,
} from 'date-fns'
import {
  createPinia,
  setActivePinia,
} from 'pinia'
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { useWorkoutSessions } from '@/pages/WorkoutSessionsPage/composables/useWorkoutSessions'
import { useAuthStore } from '@/stores/auth'

// Часовой пояс не UTC, чтобы ошибка «локальное время с суффиксом Z» была видна
const originalTz = process.env.TZ

const { fetchMock } = vi.hoisted(() => {
  process.env.TZ = 'Europe/Moscow'
  const fetchMock = vi.fn<typeof fetch>()

  vi.stubGlobal(
    'fetch',
    fetchMock,
  )

  return {
    fetchMock,
  }
})

describe(
  'useWorkoutSessions: запрос истории',
  () => {
    beforeEach(() => {
      fetchMock.mockReset()
      fetchMock.mockImplementation(async () => new Response(
        JSON.stringify({
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ))
      setActivePinia(createPinia())
      const store = useAuthStore()
      store.user = {
        id: '6f1c2a3e-0000-4000-8000-000000000003',
        email: 'athlete@test.test',
        name: 'Спортсмен',
        roleSlug: 'athlete',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }
    })

    afterAll(() => {
      process.env.TZ = originalTz
    })

    it(
      'границы периода — локальные начало и конец дня, переведённые в UTC',
      async () => {
        const { getSessions } = useWorkoutSessions()
        await getSessions()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const request = fetchMock.mock.calls[0]![0] as Request
        const url = new URL(request.url)
        const startDate = url.searchParams.get('startDate')!
        const endDate = url.searchParams.get('endDate')!

        expect(new Date(startDate).getTime()).toBe(startOfDay(new Date()).getTime())
        expect(new Date(endDate).getTime()).toBe(endOfDay(new Date()).getTime())
        expect(url.searchParams.has('userId')).toBe(false)
      },
    )
  },
)
