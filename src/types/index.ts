export interface Pagination {
  limit: number
  page: number
  total: number
  totalPages: number
}

export interface Exercise {
  id: number | undefined
  name: string
  description: string
  isActive: boolean
  repetitions: number
  sets: number
  weight: number
  muscleGroupId: number[]
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export interface GetExercisesResponse {
  data: Exercise[]
  pagination: Pagination
}
export type GetExerciseResponse = Exercise

export interface Workout {
  id: number | undefined
  name: string
  description: string
  isActive: boolean
  exercises: never[]
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export interface GetWorkoutsResponse {
  data: Workout[]
  pagination: Pagination
}
export type GetWorkoutResponse = Workout
