// src/components/forms/LoginForm/useLoginForm.ts

import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth' // Импортируем главный комposable авторизации

interface LoginForm {
  email: string
  password: string
}

export const useLoginForm = () => {
  const form = reactive<LoginForm>({
    email: '',
    password: '',
  })

  // Берем состояние и методы из useAuth.
  // Не дублируем isLoading и error!
  const {
    login, isLoading, error,
  } = useAuth()

  async function onSubmit() {
    try {
      // Делегируем реальную работу useAuth.
      // Он сам сделает запрос, сохранит токен в localStorage и обновит user.
      await login(
        form.email,
        form.password,
      )

      // Если код дошел сюда, значит вход успешен.
      // Очищаем форму (редирект лучше делать в самом Vue-компоненте через useRouter)
      form.email = ''
      form.password = ''
    }
    catch {
      // Ошибка уже записана в error.value внутри useAuth.
      // Здесь можно добавить специфичную для формы логику, если нужно.
    }
  }

  return {
    form,
    isLoading, // Пробрасываем, чтобы кнопка могла показать спиннер
    error, // Пробрасываем, чтобы компонент мог показать текст ошибки
    onSubmit,
  }
}
