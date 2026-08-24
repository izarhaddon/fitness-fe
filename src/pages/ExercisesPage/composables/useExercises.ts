// src/pages/ExercisesPage/composables/useExercises.ts

import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api'
import type {
  Exercise,
  GetExercisesResponse,
  Pagination,
} from '@/types'

export const useAdminExercisesPage = () => {
  const table = ref<Exercise[]>([])
  const isLoading = ref(false)
  const pagination = reactive<Pagination>({
    page: 0,
    totalPages: 0,
    total: 0,
    limit: 0,
  })

  async function getTable(): Promise<void> {
    isLoading.value = true

    try {
      const response = await api.get<GetExercisesResponse>('/api/exercises')
      table.value = response.data.data
      Object.assign(
        pagination,
        response.data.pagination,
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
    table,
    isLoading,
    pagination,
    getTable,
  }
}
