// src/components/forms/WorkoutForm/schemas/index.ts
import { z } from 'zod'

const workoutExerciseItemSchema = z.object({
  exerciseId: z.string().min(
    1,
    {
      error: 'Выберите упражнение из списка',
    },
  ),
  order: z.number().int().min(
    1,
    {
      error: 'Порядок должен быть >= 1',
    },
  ),
  sets: z.number().int().min(
    0,
    {
      error: 'Количество подходов не может быть отрицательным',
    },
  ),
  repetitions: z
    .number()
    .int()
    .min(
      0,
      {
        error: 'Количество повторений не может быть отрицательным',
      },
    ),
  weight: z.number().min(
    0,
    {
      error: 'Вес не может быть отрицательным',
    },
  ),
})

export const workoutSchema = z.object({
  name: z.string().min(
    3,
    {
      error: 'Название должно содержать минимум 3 символа',
    },
  ),
  description: z.preprocess(
    val => (typeof val === 'string' && val.trim() === '' ? null : val),
    z.string().nullable().optional(),
  ),
  isActive: z.boolean(),
  exercises: z
    .array(workoutExerciseItemSchema)
    .min(
      1,
      {
        error: 'Добавьте хотя бы одно упражнение в тренировку',
      },
    ),
})
