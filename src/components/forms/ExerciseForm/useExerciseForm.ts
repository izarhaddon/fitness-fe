import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'
import type { Exercise } from '@/types'
import type { AxiosResponse } from 'axios'

export const useExerciseForm = () => {
  const form = reactive<Exercise>({
    id: undefined,
    name: '',
    description: '',
    repetitions: 0,
    sets: 0,
    weight: 0,
    isActive: true,
    createdAt: undefined,
    updatedAt: undefined,
    muscleGroupId: [],
  })
  const isLoading = ref<boolean>(false)

  async function getExerciseById(id: number) {
    isLoading.value = true

    try {
      const response = await api.get<AxiosResponse<Exercise>>(`/api/exercises/${id}`)
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

  async function onSubmit() {
    isLoading.value = true

    try {
      const response = await api.post<AxiosResponse<Exercise>>(
        '/api/exercises',
        {
          ...form,
        },
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

  return {
    form,
    getExerciseById,
    onSubmit,
  }
}
