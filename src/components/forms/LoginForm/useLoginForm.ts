import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'

interface LoginForm {
  email: string
  password: string
}

export const useLoginForm = () => {
  const form = reactive<LoginForm>({
    email: '',
    password: '',
  })
  const isLoading = ref(false)

  async function onSubmit() {
    isLoading.value = true

    try {
      const response = await api.post(
        '/api/login',
        {
          ...form,
        },
      )
      localStorage.setItem(
        'token',
        response.data.token,
      )
    }
    catch (error) {
      console.error(error)
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    form,
    onSubmit,
  }
}
