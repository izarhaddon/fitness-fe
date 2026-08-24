// src/pages/WorkoutsPage/composables/useWorkouts.ts

import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api'
import type {
  GetWorkoutsResponse,
  Workout,
  Pagination,
} from '@/types'

const useWorkouts = () => {
  const table = ref<Workout[]>([])
  const pagination = reactive<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const isLoading = ref<boolean>(false)

  async function getWorkouts() {
    isLoading.value = true
    try {
      // Передаем params, чтобы запрос реально учитывал пагинацию
      // Тип params тоже автоматически проверяется благодаря openapi-typescript!
      const response = await api.get<GetWorkoutsResponse>(
        '/api/workouts',
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
        },
      )

      table.value = response.data.data
      Object.assign(
        pagination,
        response.data.pagination,
      )
    }
    catch (error) {
      console.error(
        'Ошибка при загрузке тренировок:',
        error,
      )
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
