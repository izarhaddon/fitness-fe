// src/types/index.ts

import type {
  components,
  paths,
} from './api' // Убедись, что путь ведет к сгенерированному файлу (без .ts в импорте)

// ==========================================
// ПЕРЕИСПОЛЬЗУЕМЫЕ МОДЕЛИ (из components.schemas)
// ==========================================
export type User = components['schemas']['User']
export type Exercise = components['schemas']['Exercise']
export type WorkoutExerciseWithDetails = components['schemas']['WorkoutExerciseWithDetails']
export type Workout = components['schemas']['Workout']
export type WorkoutAssignment = components['schemas']['WorkoutAssignment']
export type Pagination = components['schemas']['Pagination']

// ==========================================
// ТИПЫ ОТВЕТОВ API (из paths)
// ==========================================
export type LoginResponse
  = paths['/auth/login']['post']['responses'][200]['content']['application/json']
export type RegisterResponse
  = paths['/auth/registration']['post']['responses'][201]['content']['application/json']
export type MeResponse = paths['/auth/me']['get']['responses'][200]['content']['application/json']

export type GetExercisesResponse
  = paths['/exercises']['get']['responses'][200]['content']['application/json']
export type GetWorkoutsResponse
  = paths['/workouts']['get']['responses'][200]['content']['application/json']
export type GetMyAssignmentsResponse
  = paths['/assignments/me']['get']['responses'][200]['content']['application/json']
