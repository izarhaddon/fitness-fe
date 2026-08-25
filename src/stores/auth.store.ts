// src/stores/auth.store.ts

import { defineStore } from 'pinia'
import {
  ref,
  computed,
} from 'vue'
import { api } from '@/utils/api'
import { AxiosError } from 'axios'
import type {
  LoginResponse,
  MeResponse,
  User,
} from '@/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('token'))
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const isInitialized = ref<boolean>(false)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    // Исправлено на roleSlug согласно вашим OpenAPI типам
    const isTrainer = computed(() => user.value?.roleSlug === 'trainer')
    const isAthlete = computed(() => user.value?.roleSlug === 'athlete')
    const isAdmin = computed(() => user.value?.roleSlug === 'admin')

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
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

        return response.data
      }
      catch (err: unknown) {
        if (err instanceof AxiosError) {
          error.value = err.response?.data?.error || 'Ошибка при входе в систему'
          throw new Error(`${error.value}`)
        }
        throw err
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
      error.value = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }

    async function init() {
      if (isInitialized.value) return

      if (token.value && !user.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        await fetchMe()
      }

      isInitialized.value = true
    }

    // Запускаем инициализацию сразу при создании стора
    init()

    return {
      user,
      token,
      isLoading,
      error,
      isInitialized,
      isAuthenticated,
      isTrainer,
      isAthlete,
      isAdmin,
      login,
      fetchMe,
      logout,
      init,
    }
  },
)
