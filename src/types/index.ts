// src/types/index.ts

// ==========================================
// 1. Базовые сущности
// ==========================================

export interface Role {
  id: string
  name: string
  slug: 'admin' | 'trainer' | 'athlete'
}

export interface User {
  id: string // UUID
  email: string
  name: string
  roleSlug: 'admin' | 'trainer' | 'athlete' // Удобный union-type для Vue-шаблонов (v-if="user.roleSlug === 'trainer'")
  createdAt: string // ISO 8601 строка
  updatedAt: string
}

export interface Exercise {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  order: number
  sets: number
  repetitions: number // Важно: именно repetitions, как в схеме
  weight: number
  exercise: Exercise // Вложенный объект с деталями упражнения
}

export interface Workout {
  id: string
  name: string
  description: string | null
  isActive: boolean
  creatorId: string // Кто создал (тренер или спортсмен)
  createdAt: string
  updatedAt: string
  exercises: WorkoutExercise[] // Массив связок, а не просто упражнений
}

// ==========================================
// 2. Ответы API (Responses)
// ==========================================

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AuthResponse {
  user: User
  token?: string // Присутствует при логине/регистрации, отсутствует при запросе /me
}

export type GetRolesResponse = Role[]

export interface GetExercisesResponse {
  data: Exercise[]
  pagination: Pagination
}

export type GetExerciseResponse = Exercise

export interface GetWorkoutsResponse {
  data: Workout[]
  pagination: Pagination
}

export type GetWorkoutResponse = Workout
