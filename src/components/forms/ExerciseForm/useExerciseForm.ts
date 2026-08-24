// src/components/forms/ExerciseForm/useExerciseForm.ts

import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api'
import type { Exercise } from '@/types'

// Форма содержит только те поля, которые есть в справочнике Exercise
// и которые мы можем отправлять на бэкенд (согласно CreateExerciseInput / UpdateExerciseInput)
type ExerciseForm = {
  id?: string
  name: string
  description: string | null
  isActive: boolean
}

export const useExerciseForm = () => {
  const form = reactive<ExerciseForm>({
    id: undefined,
    name: '',
    description: null,
    isActive: true,
  })

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function getExerciseById(exerciseId: string) {
    isLoading.value = true
    error.value = null

    try {
      // Исправлен URL и тип ID (string, а не number)
      const response = await api.get<Exercise>(`/api/exercises/${exerciseId}`)
      Object.assign(
        form,
        response.data,
      )
    }
    catch (err) {
      console.error(
        'Ошибка при загрузке упражнения:',
        err,
      )
      error.value = 'Не удалось загрузить данные упражнения'
    }
    finally {
      isLoading.value = false
    }
  }

  async function onSubmit() {
    isLoading.value = true
    error.value = null

    try {
      // Отправляем только те поля, которые ожидает Zod-схема на бэкенде
      const payload = {
        name: form.name,
        description: form.description,
        isActive: form.isActive,
      }

      let response
      if (form.id) {
        // Исправлена типизация Axios: указываем тип данных ответа, а не AxiosResponse
        response = await api.put<Exercise>(
          `/api/exercises/${form.id}`,
          payload,
        )
      }
      else {
        response = await api.post<Exercise>(
          '/api/exercises',
          payload,
        )
      }

      // Обновляем форму данными с бэкенда (например, чтобы получить сгенерированный id и даты)
      Object.assign(
        form,
        response.data,
      )

      return response.data
    }
    catch (err) {
      console.error(
        'Ошибка при сохранении упражнения:',
        err,
      )
      error.value = 'Не удалось сохранить упражнение'
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  function resetForm() {
    form.id = undefined
    form.name = ''
    form.description = null
    form.isActive = true
    error.value = null
  }

  return {
    form,
    isLoading,
    error,
    getExerciseById,
    onSubmit,
    resetForm,
  }
}
