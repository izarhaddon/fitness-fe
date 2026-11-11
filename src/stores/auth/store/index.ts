// src/stores/auth.store.ts

import { defineStore } from 'pinia'
import {
  computed,
  ref,
} from 'vue'

import { api } from '@/utils/api'
import {
  ApiError,
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'
import type {
  AuthResponse,
  RegisterInput,
  User,
} from '@/stores/auth/types'

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
        const data = await unwrap(api.POST(
          '/auth/login',
          {
            body: {
              email,
              password,
            },
          },
        ))

        setSession(data)

        return data
      }
      catch (err) {
        error.value = getErrorMessage(
          err,
          'Ошибка при входе в систему',
        )
        throw err
      }
      finally {
        isLoading.value = false
      }
    }

    // Регистрация сразу авторизует пользователя — так же, как вход
    async function register(input: RegisterInput) {
      isLoading.value = true
      error.value = null

      try {
        const data = await unwrap(api.POST(
          '/auth/registration',
          {
            body: input,
          },
        ))

        setSession(data)

        return data
      }
      catch (err) {
        error.value = getErrorMessage(
          err,
          'Ошибка при регистрации',
        )
        throw err
      }
      finally {
        isLoading.value = false
      }
    }

    function setSession(data: AuthResponse) {
      token.value = data.token
      user.value = data.user
      isInitialized.value = true
      localStorage.setItem(
        'token',
        data.token,
      )
    }

    async function fetchMe() {
      if (!token.value) return

      isLoading.value = true
      try {
        user.value = await unwrap(api.GET('/auth/me'))
      }
      catch (err) {
        const isServerUnavailable = err instanceof ApiError && (err.status === 0 || err.status >= 500)

        if (isServerUnavailable) {
          // Сеть или сервер недоступны: токен не трогаем (он может быть валидным), пользователь остаётся неавторизованным
          user.value = null
          error.value = 'Сервер недоступен, попробуйте позже'
          return
        }

        // Токен отклонён (401) или пользователь не найден — выходим
        logout()
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
      register,
      fetchMe,
      logout,
      init,
    }
  },
)
