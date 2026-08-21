import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'
import type { Workout } from '@/types'

type WorkoutForm = Workout

export const useWorkoutForm = () => {
  const form = reactive<WorkoutForm>({
    id: undefined,
    name: '',
    description: '',
    isActive: true,
    exercises: [
      {
        id: 3,
        name: 'Упражнение 1',
        description: 'Описание упражнения 1',
        isActive: true,
        repetitions: 0,
        sets: 0,
        weight: 0,
        muscleGroupId: null,
        createdAt: '2026-08-18T13:44:21.561Z',
        updatedAt: '2026-08-18T13:44:21.561Z',
        muscleGroup: null,
      },
    ],
    createdAt: undefined,
    updatedAt: undefined,
  })

  const isLoading = ref(false)

  async function onSubmit() {
    isLoading.value = true
    let response
    try {
      response = form.id
        ? await api.put(
            `/api/workouts/${form.id}`,
            form,
          )
        : await api.post(
            '/api/workouts',
            form,
          )
      Object.assign(
        form,
        response.data,
      )
    }
    catch (error) {
      console.error(error)
    }
    finally {
      isLoading.value = false
    }
  }

  async function getWorkoutById(workoutId: number) {
    isLoading.value = true
    try {
      const response = await api.get(`/api/workouts/${workoutId}`)
      Object.assign(
        form,
        response.data,
      )
    }
    catch (error) {
      console.error(error)
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    form,
    onSubmit,
    getWorkoutById,
  }
}
