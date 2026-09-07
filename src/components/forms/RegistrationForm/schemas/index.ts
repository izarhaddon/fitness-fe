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
