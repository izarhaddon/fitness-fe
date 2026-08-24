// src/composables/useAuth.ts

import {
  ref,
  computed,
} from 'vue'
import { api } from '@/utils/api'
import type {
  LoginResponse,
  MeResponse,
  User,
} from '@/types'
import { AxiosError } from 'axios'

export const useAuth = () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Вычисляемое свойство для быстрой проверки авторизации в шаблонах
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Вычисляемое свойство для проверки роли (удобно для v-if в шаблонах)
  const isAdmin = computed(() => user.value?.roleSlug === 'admin')
  const isTrainer = computed(() => user.value?.roleSlug === 'trainer')
  const isAthlete = computed(() => user.value?.roleSlug === 'athlete')

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post<LoginResponse>(
        '/api/auth/login',
        {
          email,
          password,
        },
      )

      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem(
        'token',
        response.data.token,
      )

      return response.data
    }
    catch (err: unknown) {
      if (err instanceof AxiosError) {
        error.value = err.response?.data?.error || 'Ошибка при входе в систему'
        throw error
      }
    }
    finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return

    isLoading.value = true
    try {
      const response = await api.get<MeResponse>('/api/auth/me')
      user.value = response.data.user
    }
    catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Если токен протух или невалиден, очищаем состояние
        logout()
      }
    }
    finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    // Опционально: перенаправление на страницу логина
    // window.location.href = '/login'
  }

  // При инициализации, если токен есть, но пользователя нет, пытаемся его получить
  if (token.value && !user.value) {
    fetchMe()
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isTrainer,
    isAthlete,
    login,
    fetchMe,
    logout,
  }
}
