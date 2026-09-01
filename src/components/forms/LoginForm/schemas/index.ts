// src/components/forms/LoginForm/schemas/index.ts.ts

import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({
    error: 'Введите корректный email',
  }),
  password: z.string().min(
    4,
    {
      error: 'Пароль должен содержать минимум 4 символа',
    },
  ),
})
