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

export type GetExercisesResponse = Exercise[]
export type GetExerciseResponse = Exercise
