// src/components/forms/RegistrationForm/registration.schema.ts

import { z } from 'zod'

export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(
        2,
        {
          error: 'Имя должно содержать минимум 2 символа',
        },
      )
      .optional()
      .or(z.literal('')),
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
        error: 'Пароль должен содержать минимум 4 символов',
      },
    ),
    passwordRepeat: z.string().min(
      4,
      {
        error: 'Повторите пароль',
      },
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
  .refine(
    data => data.password === data.passwordRepeat,
    {
      message: 'Пароли не совпадают',
      path: [
        'passwordRepeat',
      ], // Привязываем ошибку конкретно к полю подтверждения
    },
  )

export type RegistrationFormType = z.infer<typeof registrationSchema>
