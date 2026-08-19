<script setup lang="ts">
import { useRegistrationForm } from '@/components/forms/RegistrationForm/useRegistrationForm.ts'

const {
  form, formRoleList, getRoleList, onSubmit,
} = useRegistrationForm()

getRoleList()
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="email">email</label>
      <input
        id="email"
        v-model="form.email"
        name="email"
        type="email"
        required
      />
    </div>

    <div>
      <label for="password">password</label>
      <input
        id="password"
        v-model="form.password"
        name="password"
        type="password"
        required
      />
    </div>

    <div>
      <label for="passwordRepeat">passwordRepeat</label>
      <input
        id="passwordRepeat"
        v-model="form.passwordRepeat"
        name="passwordRepeat"
        type="password"
        required
      />
    </div>

    <div>
      <select>
        <option
          v-for="role in formRoleList"
          :key="role.id"
        >
          {{ role.name }}
        </option>
      </select>
    </div>

    <div>
      <button
        type="submit"
        :disabled="
          !(
            form.email &&
            form.password &&
            form.passwordRepeat &&
            form.password === form.passwordRepeat
          )
        "
      >
        login
      </button>
    </div>
  </form>
</template>

<style scoped></style>
