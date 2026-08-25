// src/components/forms/LoginForm/useLoginForm.ts

import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  loginSchema,
  type LoginFormType,
} from './login.schema'

export const useLoginForm = () => {
  const router = useRouter()
  const authStore = useAuthStore() // Работает идентично вашему useAuth(), но гарантирует синглтон

  const form = reactive<LoginFormType>({
    email: '',
    password: '',
  })

  // Хранилище ошибок конкретно для полей формы
  const formErrors = reactive<Record<keyof LoginFormType, string>>({
    email: '',
    password: '',
  })

  async function onSubmit() {
    // 1. Сбрасываем старые ошибки
    formErrors.email = ''
    formErrors.password = ''

    // 2. Валидация через Zod v4
    const result = loginSchema.safeParse(form)

    if (!result.success) {
      // 3. Маппинг ошибок Zod на поля формы
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormType
        formErrors[field] = issue.message
      })
      return // Прерываем выполнение, если есть ошибки валидации
    }

    // 4. Если валидация прошла, делегируем запрос в store
    try {
      await authStore.login(
        form.email,
        form.password,
      )

      // 5. Очистка формы при успехе
      form.email = ''
      form.password = ''

      // 6. Редирект (лучше делать здесь, так как мы знаем, что авторизация успешна)
      router.push({
        name: 'HomePage',
      })
    }
    catch {
      // Ошибка уже записана в authStore.error внутри login()
      // Здесь можно добавить специфичную логику, если нужно
    }
  }

  return {
    form,
    formErrors,
    isLoading: authStore.isLoading,
    globalError: authStore.error, // Глобальная ошибка от сервера (например, "Неверный пароль")
    onSubmit,
  }
}
