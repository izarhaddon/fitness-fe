// src/components/forms/ExerciseForm/schemas/index.ts

import { z } from 'zod'

export const exerciseSchema = z.object({
  name: z.string().min(
    2,
    {
      error: 'Название должно содержать минимум 2 символа',
    },
  ),
  description: z.preprocess(
    val => (typeof val === 'string' && val.trim() === '' ? null : val),
    z.string().nullable().optional(),
  ),
  isActive: z.boolean(),
})
