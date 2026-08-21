import {
  reactive,
  ref,
} from 'vue'
import { api } from '@/utils/api.ts'

interface Role {
  id: number
  name: string
  slug: string
}

interface RegistrationForm {
  email: string
  password: string
  passwordRepeat: string
  role: string
}

export const useRegistrationForm = () => {
  const form = reactive<RegistrationForm>({
    email: '',
    password: '',
    passwordRepeat: '',
    role: '',
  })

  const isLoading = ref(false)

  const formRoleList = reactive<Role[]>([])

  async function onSubmit() {
    isLoading.value = true
    try {
      const response = await api.post(
        `/api/auth/registration`,
        {
          email: form.email,
          password: form.password,
          role: form.role,
        },
      )
    }
    catch (error) {
      console.log(error)
    }
    finally {
      isLoading.value = false
    }
  }

  async function getRoleList() {
    isLoading.value = true
    try {
      const response = await api.get(`/api/roles`)
      Object.assign(
        formRoleList,
        response.data,
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
    formRoleList,
    onSubmit,
    getRoleList,
  }
}
