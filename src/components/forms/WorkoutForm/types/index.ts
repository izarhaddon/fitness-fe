// src/components/forms/WorkoutForm/types/index.ts

import type { components } from '@/types/api'

export type Workout = components['schemas']['WorkoutResponse']

export type WorkoutExerciseItemInput = components['schemas']['WorkoutExerciseItemRequest']

export type Exercise = components['schemas']['ExerciseResponse']
