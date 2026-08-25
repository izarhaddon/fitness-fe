// src/components/forms/RegistrationForm/RegistrationForm.vue

<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NAlert,
} from 'naive-ui'
import { RouterLink } from 'vue-router'
import { useRegistrationForm } from '@/components/forms/RegistrationForm/useRegistrationForm'

const {
  form, formErrors, isLoading, globalError, roleOptions, onSubmit,
} = useRegistrationForm()
</script>

<template>
  <div class="registration-block">
    <h1 class="registration-block__title">Регистрация</h1>

    <NAlert
      v-if="globalError"
      type="error"
      closable
      class="registration-block__alert"
      @close="globalError = null"
    >
      {{ globalError }}
    </NAlert>

    <NForm
      :model="form"
      @submit.prevent="onSubmit"
      class="registration-block__form"
    >
      <NFormItem
        label="Имя (необязательно)"
        path="name"
        :show-feedback="!!formErrors.name"
      >
        <NInput
          v-model:value="form.name"
          size="large"
          placeholder="Иван Иванов"
          :status="formErrors.name ? 'error' : undefined"
          autocomplete="name"
        />
        <template #feedback>
          {{ formErrors.name }}
        </template>
      </NFormItem>

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
          placeholder="Минимум 6 символов"
          show-password-on="click"
          :status="formErrors.password ? 'error' : undefined"
          autocomplete="new-password"
        />
        <template #feedback>
          {{ formErrors.password }}
        </template>
      </NFormItem>

      <NFormItem
        label="Повторите пароль"
        path="passwordRepeat"
        :show-feedback="!!formErrors.passwordRepeat"
      >
        <NInput
          v-model:value="form.passwordRepeat"
          type="password"
          size="large"
          placeholder="Повторите пароль"
          show-password-on="click"
          :status="formErrors.passwordRepeat ? 'error' : undefined"
          autocomplete="new-password"
          @keydown.enter="onSubmit"
        />
        <template #feedback>
          {{ formErrors.passwordRepeat }}
        </template>
      </NFormItem>

      <NFormItem
        label="Роль"
        path="roleSlug"
        :show-feedback="!!formErrors.roleSlug"
      >
        <NSelect
          v-model:value="form.roleSlug"
          size="large"
          :options="roleOptions"
          :status="formErrors.roleSlug ? 'error' : undefined"
          placeholder="Выберите роль"
        />
        <template #feedback>
          {{ formErrors.roleSlug }}
        </template>
      </NFormItem>

      <div class="registration-block__button-holder">
        <NButton
          type="primary"
          block
          size="large"
          native-type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          class="registration-block__button"
        >
          Зарегистрироваться
        </NButton>
      </div>
    </NForm>

    <div class="registration-block__footer">
      <span>Уже есть аккаунт? </span>
      <RouterLink
        :to="{ name: 'LoginPage' }"
        class="registration-block__login-link"
      >
        Войти
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.registration-block__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.registration-block__button-holder {
  padding-top: 1rem;
}

.registration-block__footer {
  padding-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--n-text-color-3);
}

.registration-block__login-link {
  color: var(--n-primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.registration-block__login-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
