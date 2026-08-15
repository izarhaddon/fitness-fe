import { ref } from 'vue'
import { api } from '@/utils/api'

export const useAdminExercisesPage = () => {
  const table = ref([])
  const isLoading = ref(false)

  async function getTable() {
    isLoading.value = true
    try {
      const response = await api.get('/api/exercises')
      table.value = response.data
    } catch (err) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  getTable()

  return {
    table,
    isLoading,
    getTable,
  }
}
