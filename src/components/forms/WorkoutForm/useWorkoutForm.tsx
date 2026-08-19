import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'

interface WorkoutForm {
  id: string
  name: string
  description: string
  exercises: never[]
}

export const useWorkoutForm = () => {
  const form = reactive<WorkoutForm>({
    id: '',
    name: '',
    description: '',
    exercises: [],
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
