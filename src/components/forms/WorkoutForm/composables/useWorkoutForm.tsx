// src/components/forms/WorkoutForm/composables/useWorkoutForm.ts

import {
  reactive,
  ref,
} from 'vue'
import { AxiosError } from 'axios'
import { api } from '@/utils/api'
import type { Workout } from '@/types'

// Тип специально для состояния формы (UI)
export type WorkoutExerciseForm = {
  exerciseId: string
  name?: string // Только для отображения в интерфейсе, на бэкенд не уйдет
  order: number
  sets: number
  repetitions: number
  weight: number
}

// Тип всей формы
export type WorkoutForm = {
  id?: string
  name: string
  description: string | null
  isActive: boolean
  exercises: WorkoutExerciseForm[]
}

export const useWorkoutForm = () => {
  // Явная типизация reactive
  const form = reactive<WorkoutForm>({
    id: undefined,
    name: '',
    description: null,
    isActive: true,
    exercises: [],
  })

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function getWorkoutById(workoutId: string) {
    isLoading.value = true
    error.value = null

    try {
      // Убран лишний /api, если baseURL уже содержит его
      const response = await api.get<Workout>(`/api/workouts/${workoutId}`)
      const data = response.data

      form.id = data.id
      form.name = data.name
      form.description = data.description
      form.isActive = data.isActive
      form.exercises = data.exercises.map(we => ({
        exerciseId: we.exerciseId,
        name: we.exercise.name, // Берем имя из вложенного объекта для UI
        order: we.order,
        sets: we.sets,
        repetitions: we.repetitions,
        weight: we.weight,
      }))
    }
    catch (err: unknown) {
      error.value = err instanceof AxiosError ? err.response?.data?.error : 'Ошибка загрузки'
      console.error(
        'Ошибка при загрузке тренировки:',
        err,
      )
    }
    finally {
      isLoading.value = false
    }
  }

  async function onSubmit() {
    isLoading.value = true
    error.value = null

    try {
      // Очищаем payload от UI-полей (name) перед отправкой на бэкенд
      const payload = {
        name: form.name,
        description: form.description,
        isActive: form.isActive,
        exercises: form.exercises.map(({
          exerciseId, order, sets, repetitions, weight,
        }) => ({
          exerciseId,
          order,
          sets,
          repetitions,
          weight,
        })),
      }

      let response
      if (form.id) {
        response = await api.put<Workout>(
          `/api/workouts/${form.id}`,
          payload,
        )
      }
      else {
        response = await api.post<Workout>(
          '/api/workouts',
          payload,
        )
      }

      Object.assign(
        form,
        response.data,
      )
      return response.data
    }
    catch (err: unknown) {
      error.value = err instanceof AxiosError ? err.response?.data?.error : 'Ошибка сохранения'
      console.error(
        'Ошибка при сохранении тренировки:',
        err,
      )
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
    form.exercises = []
    error.value = null
  }

  return {
    form,
    isLoading,
    error,
    getWorkoutById,
    onSubmit,
    resetForm,
  }
}
