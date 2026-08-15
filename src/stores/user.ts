// stores/user.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export interface User {
  id: number
  name: string
  email: string
}

interface LoginCredentials {
  email: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  // === Состояние ===
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // === Геттеры ===
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const fullName = computed(() => user.value?.name ?? '')

  // === Действия ===
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await api.post<{ token: string; user: User }>(
        '/auth/login',
        credentials,
      )

      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`
    } catch (err: any) {
      error.value = err.response?.data?.message ?? 'Ошибка входа'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return

    try {
      const { data } = await api.get<User>('/auth/me')
      user.value = data
      api.defaults.headers.common.Authorization = `Bearer ${token.value}`
    } catch {
      // токен протух — очищаем
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
  }

  // Инициализация: при загрузке подтягиваем текущего юзера, если есть токен
  if (token.value) {
    fetchCurrentUser()
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    fullName,
    login,
    logout,
    fetchCurrentUser,
  }
})
