// src/components/forms/LoginForm/LoginForm.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/components/forms/LoginForm/schemas'
import UIButton from '@/components/UIButton.vue'
import UITextInput from '@/components/UITextInput.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const formError = ref<string | null>(null)

const onSubmit = async () => {
  formError.value = null

  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  })

  if (!result.success) {
    const firstIssue = result.error.issues[0]
    formError.value = firstIssue?.message || 'Ошибка валидации данных'
    return
  }

  try {
    await authStore.login(
      email.value,
      password.value,
    )
    await router.push('/')
  }
  catch {
    formError.value = authStore.error || 'Неверный email или пароль'
  }
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="login-form"
  >
    <div
      v-if="formError"
      class="error-message"
    >
      {{ formError }}
    </div>

    <UITextInput
      id="email"
      label="Email"
      name="email"
      type="email"
      v-model:value="email"
      :disabled="authStore.isLoading"
      required
    />

    <UITextInput
      id="password"
      label="Пароль"
      name="password"
      type="password"
      v-model:value="password"
      :disabled="authStore.isLoading"
      required
    />

    <UIButton
      type="submit"
      :disabled="authStore.isLoading"
    >
      {{ authStore.isLoading ? 'Вход...' : 'Войти' }}
    </UIButton>
  </form>
</template>
