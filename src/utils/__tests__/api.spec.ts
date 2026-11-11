// src/utils/__tests__/api.spec.ts

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { api } from '@/utils/api'

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

function getLastRequest(): Request {
  const lastCall = fetchMock.mock.calls.at(-1)

  if (!lastCall) {
    throw new Error('fetch не был вызван')
  }

  return lastCall[0] as Request
}

describe(
  'api',
  () => {
    const assignMock = vi.fn()

    beforeEach(() => {
      localStorage.clear()
      fetchMock.mockReset()
      assignMock.mockReset()

      vi.stubGlobal(
        'location',
        {
          pathname: '/workouts',
          search: '',
          assign: assignMock,
        },
      )
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe(
      'заголовок Authorization',
      () => {
        it(
          'отправляет заголовок Authorization с Bearer-токеном, если токен есть в localStorage',
          async () => {
            localStorage.setItem(
              'token',
              'test-token',
            )
            fetchMock.mockResolvedValue(createJsonResponse(
              [],
              200,
            ))

            await api.GET('/workouts')

            expect(getLastRequest().headers.get('Authorization')).toBe('Bearer test-token')
          },
        )

        it(
          'не отправляет заголовок Authorization, если токена нет в localStorage',
          async () => {
            fetchMock.mockResolvedValue(createJsonResponse(
              [],
              200,
            ))

            await api.GET('/workouts')

            expect(getLastRequest().headers.get('Authorization')).toBeNull()
          },
        )
      },
    )

    describe(
      'обработка 401',
      () => {
        it(
          'удаляет токен и перенаправляет на страницу логина с redirect текущего пути',
          async () => {
            localStorage.setItem(
              'token',
              'expired-token',
            )
            fetchMock.mockResolvedValue(createJsonResponse(
              {
                error: 'Неавторизован',
              },
              401,
            ))

            await api.GET('/workouts')

            expect(localStorage.getItem('token')).toBeNull()
            expect(assignMock).toHaveBeenCalledTimes(1)
            expect(assignMock).toHaveBeenCalledWith('/login?redirect=%2Fworkouts')
          },
        )

        it(
          'не удаляет токен и не перенаправляет при 401 на POST /auth/login',
          async () => {
            localStorage.setItem(
              'token',
              'existing-token',
            )
            fetchMock.mockResolvedValue(createJsonResponse(
              {
                error: 'Неверный email или пароль',
              },
              401,
            ))

            const { error } = await api.POST(
              '/auth/login',
              {
                body: {
                  email: 'athlete@test.test',
                  password: 'wrong',
                },
              },
            )

            expect(error).toEqual({
              error: 'Неверный email или пароль',
            })
            expect(localStorage.getItem('token')).toBe('existing-token')
            expect(assignMock).not.toHaveBeenCalled()
          },
        )

        it(
          'сохраняет токен при успешном ответе 200',
          async () => {
            localStorage.setItem(
              'token',
              'valid-token',
            )
            fetchMock.mockResolvedValue(createJsonResponse(
              [
                {
                  id: 'workout-1',
                },
              ],
              200,
            ))

            const {
              data, response,
            } = await api.GET('/workouts')

            expect(response.status).toBe(200)
            expect(data).toEqual([
              {
                id: 'workout-1',
              },
            ])
            expect(localStorage.getItem('token')).toBe('valid-token')
            expect(assignMock).not.toHaveBeenCalled()
          },
        )
      },
    )
  },
)
