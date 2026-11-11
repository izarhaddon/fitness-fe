// src/utils/apiError.ts

// Единый способ работы с ответами openapi-fetch.
// openapi-fetch НЕ бросает исключение на 4xx/5xx — возвращает { error }. Поэтому каждый вызов
// оборачиваем в unwrap(): он возвращает data или бросает ApiError с понятным текстом.
//
//   try {
//     const workout = await unwrap(api.GET('/workouts/{id}', { params: { path: { id } } }))
//   }
//   catch (err) {
//     error.value = getErrorMessage(err, 'Не удалось загрузить тренировку')
//   }

export const NETWORK_ERROR_MESSAGE = 'Не удалось связаться с сервером. Проверьте подключение'

const statusMessages: Record<number, string> = {
  400: 'Некорректные данные',
  401: 'Требуется вход в систему',
  403: 'Недостаточно прав',
  404: 'Не найдено',
  409: 'Такая запись уже существует',
  422: 'Связанная запись не найдена',
}

export class ApiError extends Error {
  // 0 — сеть или сервер недоступны
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const getBackendMessage = (body: unknown): string | null => {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' && body.error) {
    return body.error
  }

  return null
}

const getStatusMessage = (status: number): string => {
  if (status >= 500) return 'Ошибка сервера, попробуйте позже'

  return statusMessages[status] ?? 'Не удалось выполнить запрос'
}

interface FetchResult {
  data?: unknown
  error?: unknown
  response: Response
}

export async function unwrap<R extends FetchResult>(request: Promise<R>): Promise<NonNullable<R['data']>> {
  let result: R

  try {
    result = await request
  }
  catch {
    throw new ApiError(
      NETWORK_ERROR_MESSAGE,
      0,
    )
  }

  const {
    data, error, response,
  } = result

  if (error !== undefined || !response.ok) {
    throw new ApiError(
      getBackendMessage(error) ?? getStatusMessage(response.status),
      response.status,
    )
  }

  if (data === undefined || data === null) {
    throw new ApiError(
      'Сервер вернул пустой ответ',
      response.status,
    )
  }

  return data as NonNullable<R['data']>
}

// Текст для пользователя. ApiError уже содержит понятное сообщение (с бэкенда или по статусу);
// всё остальное — ошибка в нашем коде: логируем и показываем fallback
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    return err.message
  }

  console.error(err)

  return fallback
}
