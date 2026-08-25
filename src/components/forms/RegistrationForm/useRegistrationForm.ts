// src/components/forms/RegistrationForm/useRegistrationForm.ts

import {
  reactive,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/utils/api'
import { useAuthStore } from '@/stores/auth.store'
import {
  registrationSchema,
  type RegistrationFormType,
} from './registration.schema'
import type { SelectOption } from 'naive-ui'
import { AxiosError } from 'axios'

export const useRegistrationForm = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const form = reactive<RegistrationFormType>({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    roleSlug: 'athlete', // Значение по умолчанию
  })

  const formErrors = reactive<Record<keyof RegistrationFormType, string>>({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    roleSlug: '',
  })

  const isLoading = ref(false)
  const globalError = ref<string | null>(null)

  // YAGNI: Роли фиксированы в OpenAPI, но оформим как массив для NSelect
  const roleOptions: SelectOption[] = [
    {
      label: 'Спортсмен',
      value: 'athlete',
    },
    {
      label: 'Тренер',
      value: 'trainer',
    },
  ]

  async function onSubmit() {
    // Сброс ошибок перед новой попыткой
    Object.keys(formErrors).forEach((key) => {
      formErrors[key as keyof RegistrationFormType] = ''
    })
    globalError.value = null

    // Валидация Zod v4
    const result = registrationSchema.safeParse(form)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegistrationFormType
        formErrors[field] = issue.message
      })
      return
    }

    isLoading.value = true
    try {
      const response = await api.post(
        '/api/auth/registration',
        {
          name: form.name || undefined,
          email: form.email,
          password: form.password,
          roleSlug: form.roleSlug,
        },
      )

      // Если бэкенд возвращает токен сразу (как в LoginResponse), авторизуем пользователя
      if (response.data.token && response.data.user) {
        authStore.token = response.data.token
        authStore.user = response.data.user
        localStorage.setItem(
          'token',
          response.data.token,
        )
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        router.push({
          name: 'HomePage',
        })
      }
      else {
        // Иначе перенаправляем на страницу входа
        router.push({
          name: 'LoginPage',
        })
      }
    }
    catch (err: unknown) {
      globalError.value = err instanceof AxiosError ? err.response?.data?.error : 'Ошибка при регистрации'
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    form,
    formErrors,
    isLoading,
    globalError,
    roleOptions,
    onSubmit,
  }
}
