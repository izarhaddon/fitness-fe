// src/components/forms/RegistrationForm/RegistrationForm.vue

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { registerSchema } from '@/components/forms/RegistrationForm/schemas'
import UIButton from '@/components/UIButton.vue'
import UITextInput from '@/components/UITextInput.vue'
import UISelect from '@/components/UISelect.vue'
import UIErrorMessage from '@/components/UIErrorMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const name = ref<string>('')
const roleSlug = ref<'trainer' | 'athlete'>('athlete')
const formError = ref<string | null>(null)
const isLoading = ref<boolean>(false)

const roleOptions = [
  {
    value: 'athlete',
    label: 'Спортсмен',
  },
  {
    value: 'trainer',
    label: 'Тренер',
  },
]

const onSubmit = async () => {
  formError.value = null
  isLoading.value = true

  const result = registerSchema.safeParse({
    email: email.value,
    password: password.value,
    name: name.value,
    roleSlug: roleSlug.value,
  })

  if (!result.success) {
    const firstIssue = result.error.issues[0]
    formError.value = firstIssue?.message || 'Ошибка валидации данных'
    isLoading.value = false
    return
  }

  try {
    // Через стор: он сохраняет и токен, и пользователя, иначе роутер считает пользователя неавторизованным
    await authStore.register(result.data)
    await router.push('/')
  }
  catch {
    formError.value = authStore.error || 'Ошибка при регистрации'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="registration-form"
  >
    <UIErrorMessage :message="formError" />

    <UITextInput
      id="name"
      label="Имя (необязательно)"
      name="name"
      type="text"
      v-model:value="name"
      :disabled="isLoading"
    />

    <UITextInput
      id="email"
      label="Email"
      name="email"
      type="email"
      v-model:value="email"
      :disabled="isLoading"
      required
    />

    <UITextInput
      id="password"
      label="Пароль"
      name="password"
      type="password"
      v-model:value="password"
      :disabled="isLoading"
      required
    />

    <UISelect
      id="role"
      label="Роль"
      name="role"
      :selected="roleSlug"
      :options="roleOptions"
      :disabled="isLoading"
    />

    <UIButton
      type="submit"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
    </UIButton>
  </form>
</template>
