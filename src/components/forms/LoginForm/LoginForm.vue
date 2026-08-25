<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NAlert,
} from 'naive-ui'
import { useLoginForm } from '@/components/forms/LoginForm/useLoginForm'

const {
  form, formErrors, isLoading, globalError, onSubmit,
} = useLoginForm()
</script>

<template>
  <div class="login-block">
    <h1 class="login-block__title">Вход в систему</h1>

    <NAlert
      v-if="globalError"
      type="error"
      closable
      @close="globalError = null"
    >
      {{ globalError }}
    </NAlert>

    <NForm
      :model="form"
      @submit.prevent="onSubmit"
      class="login-block__form"
    >
      <NFormItem
        label="Email"
        path="email"
        :show-feedback="!!formErrors.email"
      >
        <NInput
          v-model:value="form.email"
          size="large"
          type="text"
          placeholder="example@mail.com"
          :status="formErrors.email ? 'error' : undefined"
          autocomplete="email"
        />
        <template #feedback>
          {{ formErrors.email }}
        </template>
      </NFormItem>

      <NFormItem
        label="Пароль"
        path="password"
        :show-feedback="!!formErrors.password"
      >
        <NInput
          v-model:value="form.password"
          type="password"
          size="large"
          placeholder="Введите ваш пароль"
          show-password-on="click"
          :status="formErrors.password ? 'error' : undefined"
          autocomplete="current-password"
          @keydown.enter="onSubmit"
        />
        <template #feedback>
          {{ formErrors.password }}
        </template>
      </NFormItem>

      <div class="login-block__button-holder">
        <NButton
          type="primary"
          block
          size="large"
          native-type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          class="login-block__button"
        >
          Войти
        </NButton>
      </div>
    </NForm>

    <div class="login-block__footer">
      <span>Нет аккаунта? </span>
      <RouterLink
        :to="{ name: 'RegistrationPage' }"
        class="login-block__registration-link"
      >
        Зарегистрироваться
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-block__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-block__button-holder {
  padding-top: 1rem;
}

.login-block__footer {
  padding-top: 1rem;
}

.login-block__registration-link {
  color: var(--n-primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
</style>
