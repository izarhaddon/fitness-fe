// src/components/forms/LoginForm/login.schema.ts

import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(
      1,
      {
        error: 'Email обязателен',
      },
    )
    .email({
      error: 'Введите корректный email',
    }),
  password: z.string().min(
    4,
    {
      error: 'Пароль должен содержать минимум 6 символов',
    },
  ),
})

export type LoginFormType = z.infer<typeof loginSchema>
