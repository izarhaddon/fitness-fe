// src/stores/auth/__tests__/auth.spec.ts

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

const athleteUser: User = {
  id: '6f1c2a3e-0000-4000-8000-000000000001',
  email: 'athlete@test.test',
  name: 'Спортсмен',
  roleSlug: 'athlete',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function createJsonResponse(
  body: unknown,
  status: number,
): Response {
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
  'auth store',
  () => {
    beforeEach(() => {
      localStorage.clear()
      fetchMock.mockReset()
      setActivePinia(createPinia())
    })

    describe(
      'login',
      () => {
        it(
          'сохраняет токен в localStorage и заполняет пользователя при успешном входе',
          async () => {
            fetchMock.mockResolvedValue(createJsonResponse(
              {
                user: athleteUser,
                token: 'token-123',
              },
              200,
            ))
            const authStore = useAuthStore()

            await authStore.login(
              'athlete@test.test',
              'secret',
            )

            expect(localStorage.getItem('token')).toBe('token-123')
            expect(authStore.token).toBe('token-123')
            expect(authStore.user).toEqual(athleteUser)
            expect(authStore.isAuthenticated).toBe(true)
            expect(authStore.error).toBeNull()
            expect(authStore.isLoading).toBe(false)
          },
        )

        it(
          'устанавливает ошибку и не сохраняет токен при неудачном входе',
          async () => {
            fetchMock.mockResolvedValue(createJsonResponse(
              {
                error: 'Неверный email или пароль',
              },
              401,
            ))
            const authStore = useAuthStore()

            await expect(authStore.login(
              'athlete@test.test',
              'wrong',
            )).rejects.toThrow('Неверный email или пароль')

            expect(authStore.error).toBe('Неверный email или пароль')
            expect(localStorage.getItem('token')).toBeNull()
            expect(authStore.token).toBeNull()
            expect(authStore.user).toBeNull()
            expect(authStore.isAuthenticated).toBe(false)
            expect(authStore.isLoading).toBe(false)
          },
        )
      },
    )

    describe(
      'logout',
      () => {
        it(
          'очищает токен в localStorage и пользователя',
          async () => {
            fetchMock.mockResolvedValue(createJsonResponse(
              {
                user: athleteUser,
                token: 'token-123',
              },
              200,
            ))
            const authStore = useAuthStore()

            await authStore.login(
              'athlete@test.test',
              'secret',
            )
            authStore.logout()

            expect(localStorage.getItem('token')).toBeNull()
            expect(authStore.token).toBeNull()
            expect(authStore.user).toBeNull()
            expect(authStore.isAuthenticated).toBe(false)
          },
        )
      },
    )
  },
)
