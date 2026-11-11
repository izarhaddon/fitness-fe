// src/stores/auth/__tests__/register.spec.ts

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
import router from '@/router'
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

const newUser: User = {
  id: '6f1c2a3e-0000-4000-8000-000000000010',
  email: 'new@test.test',
  name: 'Новый спортсмен',
  roleSlug: 'athlete',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const registerInput = {
  email: newUser.email,
  password: 'password123',
  name: newUser.name,
  roleSlug: 'athlete' as const,
}

function jsonResponse(body: unknown, status: number): Response {
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
  'auth store: регистрация',
  () => {
    beforeEach(async () => {
      localStorage.clear()
      fetchMock.mockReset()
      setActivePinia(createPinia())
      await router.push('/')
    })

    it(
      'после регистрации пользователь авторизован: токен и пользователь в сторе',
      async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(
          {
            user: newUser,
            token: 'new-token',
          },
          201,
        ))

        const store = useAuthStore()
        await store.register(registerInput)

        expect(store.token).toBe('new-token')
        expect(localStorage.getItem('token')).toBe('new-token')
        expect(store.user?.id).toBe(newUser.id)
        expect(store.isAuthenticated).toBe(true)
      },
    )

    it(
      'сразу после регистрации роутер пускает на страницу, требующую входа',
      async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(
          {
            user: newUser,
            token: 'new-token',
          },
          201,
        ))

        const store = useAuthStore()
        await store.register(registerInput)
        await router.push('/workouts')

        expect(router.currentRoute.value.path).toBe('/workouts')
      },
    )

    it(
      'ошибка регистрации: текст с бэкенда в store.error, токен не сохраняется',
      async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(
          {
            error: 'Email уже занят',
          },
          400,
        ))

        const store = useAuthStore()
        await expect(store.register(registerInput)).rejects.toThrow()

        expect(store.error).toBe('Email уже занят')
        expect(store.token).toBeNull()
        expect(localStorage.getItem('token')).toBeNull()
        expect(store.isAuthenticated).toBe(false)
      },
    )
  },
)
