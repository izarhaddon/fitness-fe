// src/components/forms/WorkoutForm/types/index.ts

import type { components } from '@/types/api'

export type Workout = components['schemas']['WorkoutResponse']
export type CreateWorkoutRequest = components['schemas']['CreateWorkoutRequest']
export type UpdateWorkoutRequest = components['schemas']['UpdateWorkoutRequest']

export type WorkoutExerciseItemInput = components['schemas']['WorkoutExerciseItemRequest']

export type Exercise = components['schemas']['ExerciseResponse']
