import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'
import type {
  GetWorkoutsResponse,
  Pagination,
  Workout,
} from '@/types'

const useWorkouts = () => {
  const table = ref<Workout[]>([])
  const pagination = reactive<Pagination>({
    page: 0,
    totalPages: 0,
    total: 0,
    limit: 0,
  })
  const isLoading = ref<boolean>(false)

  async function getWorkouts() {
    isLoading.value = true
    try {
      const response = await api.get<GetWorkoutsResponse>('/api/workouts')
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
    pagination,
    isLoading,
    getWorkouts,
  }
}

export default useWorkouts
