// src/components/forms/RegistrationForm/RegistrationForm.vue

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { api } from '@/utils/api.ts'
import { registerSchema } from '@/components/forms/RegistrationForm/schemas'
import UIButton from '@/components/UIButton.vue'

const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
const name = ref<string>('')
const roleSlug = ref<'trainer' | 'athlete'>('athlete')
const formError = ref<string | null>(null)
const isLoading = ref<boolean>(false)

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
    const {
      data, error,
    } = await api.POST(
      '/auth/registration',
      {
        body: result.data,
      },
    )

    if (error) {
      formError.value = error.error || 'Ошибка при регистрации'
      return
    }

    if (data) {
      localStorage.setItem(
        'token',
        data.token,
      )
      await router.push('/')
    }
  }
  catch {
    formError.value = 'Произошла непредвиденная ошибка сети'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div v-if="formError">
      <p>{{ formError }}</p>
    </div>

    <div>
      <label for="name">Имя (необязательно)</label>
      <input
        id="name"
        v-model="name"
        type="text"
        placeholder="Иван Иванов"
        :disabled="isLoading"
      />
    </div>

    <div>
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="new@test.test"
        :disabled="isLoading"
        required
      />
    </div>

    <div>
      <label for="password">Пароль</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="password123"
        :disabled="isLoading"
        required
      />
    </div>

    <div>
      <label for="role">Роль</label>
      <select
        id="role"
        v-model="roleSlug"
        :disabled="isLoading"
      >
        <option value="athlete">Спортсмен</option>
        <option value="trainer">Тренер</option>
      </select>
    </div>

    <div>
      <UIButton
        type="submit"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </UIButton>
    </div>
  </form>
</template>
