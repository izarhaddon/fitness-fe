// src/utils/__tests__/apiError.spec.ts

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  ApiError,
  NETWORK_ERROR_MESSAGE,
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'

const result = (
  status: number,
  body: { data?: unknown, error?: unknown },
) => Promise.resolve({
  ...body,
  response: new Response(
    null,
    {
      status,
    },
  ),
})

describe(
  'unwrap',
  () => {
    it(
      'возвращает data при успешном ответе',
      async () => {
        await expect(unwrap(result(
          200,
          {
            data: {
              id: '1',
            },
          },
        ))).resolves.toEqual({
          id: '1',
        })
      },
    )

    it(
      'бросает ApiError с текстом ошибки с бэкенда и статусом',
      async () => {
        const promise = unwrap(result(
          403,
          {
            error: {
              error: 'Изменять тренировку может только её создатель',
            },
          },
        ))

        await expect(promise).rejects.toBeInstanceOf(ApiError)
        await expect(promise).rejects.toMatchObject({
          status: 403,
          message: 'Изменять тренировку может только её создатель',
        })
      },
    )

    it.each([
      [
        404,
        'Не найдено',
      ],
      [
        403,
        'Недостаточно прав',
      ],
      [
        500,
        'Ошибка сервера, попробуйте позже',
      ],
      [
        502,
        'Ошибка сервера, попробуйте позже',
      ],
      [
        418,
        'Не удалось выполнить запрос',
      ],
    ])(
      'без текста с бэкенда для статуса %i даёт сообщение «%s»',
      async (status, message) => {
        await expect(unwrap(result(
          status,
          {
            error: {},
          },
        ))).rejects.toMatchObject({
          status,
          message,
        })
      },
    )

    it(
      'сетевая ошибка превращается в ApiError со статусом 0',
      async () => {
        await expect(unwrap(Promise.reject(new TypeError('Failed to fetch')))).rejects.toMatchObject({
          status: 0,
          message: NETWORK_ERROR_MESSAGE,
        })
      },
    )

    it(
      'пустой успешный ответ считается ошибкой',
      async () => {
        await expect(unwrap(result(
          200,
          {},
        ))).rejects.toBeInstanceOf(ApiError)
      },
    )
  },
)

describe(
  'getErrorMessage',
  () => {
    it(
      'для ApiError возвращает его текст',
      () => {
        expect(getErrorMessage(
          new ApiError(
            'Тренировка не найдена',
            404,
          ),
          'fallback',
        )).toBe('Тренировка не найдена')
      },
    )

    it(
      'для прочих ошибок логирует их и возвращает fallback',
      () => {
        const consoleError = vi.spyOn(
          console,
          'error',
        ).mockImplementation(() => undefined)

        expect(getErrorMessage(
          new Error('bug'),
          'Не удалось загрузить',
        )).toBe('Не удалось загрузить')
        expect(consoleError).toHaveBeenCalled()

        consoleError.mockRestore()
      },
    )
  },
)
