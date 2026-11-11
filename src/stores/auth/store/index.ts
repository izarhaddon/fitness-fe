// src/stores/auth.store.ts

import { defineStore } from 'pinia'
import {
  computed,
  ref,
} from 'vue'

import { api } from '@/utils/api'
import type { User } from '@/stores/auth/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('token'))
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const isInitialized = ref<boolean>(false)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const isTrainer = computed(() => user.value?.roleSlug === 'trainer')
    const isAthlete = computed(() => user.value?.roleSlug === 'athlete')
    const isAdmin = computed(() => user.value?.roleSlug === 'admin')

    async function login(email: string, password: string) {
      isLoading.value = true
      error.value = null

      try {
        const {
          data, error: apiError,
        } = await api.POST(
          '/auth/login',
          {
            body: {
              email,
              password,
            },
          },
        )

        if (apiError) {
          error.value = apiError.error || 'Ошибка при входе в систему'
          throw new Error(error.value)
        }

        if (data) {
          token.value = data.token
          user.value = data.user
          localStorage.setItem(
            'token',
            data.token,
          )

          return data
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
        const {
          data, error: apiError,
        } = await api.GET('/auth/me')

        if (apiError || !data) {
          logout()
          return
        }

        user.value = data
      }
      catch {
        // Сеть или сервер недоступны: токен не трогаем (он может быть валидным), пользователь остаётся неавторизованным
        user.value = null
        error.value = 'Сервер недоступен, попробуйте позже'
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
    }

    // Один общий запрос на все одновременные вызовы (стор и роутер вызывают init почти одновременно)
    let initPromise: Promise<void> | null = null

    async function runInit() {
      if (token.value && !user.value) {
        await fetchMe()
      }

      // Если сервер был недоступен (токен есть, пользователя нет) — повторим при следующей навигации
      isInitialized.value = !token.value || !!user.value
    }

    function init(): Promise<void> {
      if (isInitialized.value) return Promise.resolve()

      initPromise ??= runInit().finally(() => {
        initPromise = null
      })

      return initPromise
    }

    void init()

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
