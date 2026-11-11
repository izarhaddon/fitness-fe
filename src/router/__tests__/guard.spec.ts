// src/router/__tests__/guard.spec.ts

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
import { RouterNames } from '@/router/types'
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

const adminUser: User = {
  id: '6f1c2a3e-0000-4000-8000-000000000002',
  email: 'admin@test.test',
  name: 'Администратор',
  roleSlug: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function mockAuthMe(user: User): void {
  fetchMock.mockImplementation(async () => new Response(
    JSON.stringify(user),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ))
}

function loginAs(user: User): void {
  localStorage.setItem(
    'token',
    `token-${user.roleSlug}`,
  )
  mockAuthMe(user)
  setActivePinia(createPinia())
}

describe(
  'router guard',
  () => {
    beforeEach(async () => {
      localStorage.clear()
      fetchMock.mockReset()
      setActivePinia(createPinia())
      await router.push('/')
    })

    it(
      'перенаправляет неавторизованного пользователя с /workouts на страницу логина с redirect',
      async () => {
        await router.push('/workouts')

        expect(router.currentRoute.value.name).toBe(RouterNames.LoginPage)
        expect(router.currentRoute.value.query.redirect).toBe('/workouts')
      },
    )

    it(
      'перенаправляет спортсмена с /exercises/create (requiresRole admin) на домашнюю страницу',
      async () => {
        loginAs(athleteUser)

        await router.push('/exercises/create')

        expect(router.currentRoute.value.name).toBe(RouterNames.HomePage)
      },
    )

    it(
      'пропускает администратора на /exercises/create (requiresRole admin)',
      async () => {
        loginAs(adminUser)

        await router.push('/exercises/create')

        expect(router.currentRoute.value.name).toBe(RouterNames.ExerciseCreatePage)
      },
    )

    it(
      'открывает /login без авторизации',
      async () => {
        await router.push('/login')

        expect(router.currentRoute.value.name).toBe(RouterNames.LoginPage)
        expect(router.currentRoute.value.fullPath).toBe('/login')
      },
    )
  },
)
