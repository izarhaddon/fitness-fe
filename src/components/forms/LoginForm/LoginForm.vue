// src/components/forms/LoginForm/LoginForm.vue

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/components/forms/LoginForm/schemas'
import UIButton from '@/components/UIButton.vue'

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

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        name="email"
        placeholder="test@test.test"
        :disabled="authStore.isLoading"
        autocomplete="email"
        required
      />
    </div>

    <div class="form-group">
      <label for="password">Пароль</label>
      <input
        id="password"
        v-model="password"
        type="password"
        name="password"
        placeholder="Введите пароль"
        :disabled="authStore.isLoading"
        autocomplete="current-password"
        required
        @keyup.enter="onSubmit"
      />
    </div>

    <UIButton
      type="submit"
      :disabled="authStore.isLoading"
    >
      {{
        authStore.isLoading ? 'Вход...' : 'Войти'
      }}
    </UIButton>
  </form>
</template>
