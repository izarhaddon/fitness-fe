// src/components/forms/RegistrationForm/schemas/index.ts.ts

import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email({
    error: 'Введите корректный email',
  }),
  password: z.string().min(
    4,
    {
      error: 'Пароль должен содержать минимум 4 символа',
    },
  ),
  // Преобразуем пустую строку в undefined, чтобы удовлетворить optional() и min(2)
  name: z.preprocess(
    val => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z
      .string()
      .min(
        2,
        {
          error: 'Имя должно содержать минимум 2 символа',
        },
      )
      .optional(),
  ),
  // Zod v4 синтаксис: z.enum принимает объект, ошибка через { error: '...' }
  roleSlug: z.enum(
    {
      trainer: 'trainer',
      athlete: 'athlete',
    },
    {
      error: 'Выберите корректную роль',
    },
  ),
})
