// src/stores/auth/__tests__/init.spec.ts

import {
  createPinia,
  setActivePinia,
} from 'pinia'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/stores/auth'

// openapi-fetch запоминает fetch при создании клиента — подменяем до импортов
const { fetchMock } = vi.hoisted(() => {
  const fetchMock = vi.fn<typeof fetch>()

  vi.stubGlobal(
    'fetch',
    fetchMock,
  )

  return {
    fetchMock,
  }
})

const user: User = {
  id: '6f1c2a3e-0000-4000-8000-000000000002',
  email: 'trainer@test.test',
  name: 'Тренер',
  roleSlug: 'trainer',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

describe(
  'auth store: init и fetchMe',
  () => {
    beforeEach(() => {
      localStorage.clear()
      fetchMock.mockReset()
      setActivePinia(createPinia())
    })

    it(
      'сетевая ошибка в /auth/me не роняет init, токен сохраняется, ставится ошибка',
      async () => {
        localStorage.setItem(
          'token',
          'valid-token',
        )
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

        const store = useAuthStore()
        await expect(store.init()).resolves.toBeUndefined()

        expect(store.user).toBeNull()
        expect(store.token).toBe('valid-token')
        expect(localStorage.getItem('token')).toBe('valid-token')
        expect(store.isAuthenticated).toBe(false)
        expect(store.error).toBeTruthy()
      },
    )

    it(
      'после сетевой ошибки следующий init повторяет запрос и авторизует пользователя',
      async () => {
        localStorage.setItem(
          'token',
          'valid-token',
        )
        fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))

        const store = useAuthStore()
        await store.init()
        expect(store.isInitialized).toBe(false)

        fetchMock.mockResolvedValueOnce(jsonResponse(user))
        await store.init()

        expect(store.user?.id).toBe(user.id)
        expect(store.isAuthenticated).toBe(true)
        expect(store.isInitialized).toBe(true)
      },
    )

    it(
      'одновременные вызовы init делают один запрос /auth/me',
      async () => {
        localStorage.setItem(
          'token',
          'valid-token',
        )
        fetchMock.mockImplementation(async () => jsonResponse(user))

        const store = useAuthStore()
        await Promise.all([
          store.init(),
          store.init(),
          store.init(),
        ])

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(store.user?.id).toBe(user.id)
      },
    )

    it(
      '401 от /auth/me разлогинивает и завершает инициализацию',
      async () => {
        localStorage.setItem(
          'token',
          'expired-token',
        )
        // Не даём api.ts уйти на страницу логина в jsdom
        vi.stubGlobal(
          'location',
          {
            ...window.location,
            assign: vi.fn(),
            pathname: '/login',
            search: '',
          },
        )
        fetchMock.mockResolvedValue(jsonResponse(
          {
            error: 'Недействительный или истёкший токен',
          },
          401,
        ))

        const store = useAuthStore()
        await store.init()

        expect(store.token).toBeNull()
        expect(store.user).toBeNull()
        expect(store.isInitialized).toBe(true)
        vi.unstubAllGlobals()
        vi.stubGlobal(
          'fetch',
          fetchMock,
        )
      },
    )
  },
)
