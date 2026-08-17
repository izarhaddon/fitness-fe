import { ref } from 'vue'
import { api } from '@/utils/api'
import type {
  Exercise,
  GetExercisesResponse,
} from '@/types'

export const useAdminExercisesPage = () => {
  const table = ref<Exercise[]>([])
  const isLoading = ref(false)

  async function getTable(): Promise<void> {
    isLoading.value = true

    try {
      const response = await api.get<GetExercisesResponse>('/api/exercises')
      table.value = response.data
    }
    catch (error) {
      console.error(error)
    }
    finally {
      isLoading.value = false
    }
  }

  void getTable()

  return {
    table,
    isLoading,
    getTable,
  }
}
