<script setup lang="ts">
import { useLoginForm } from '@/components/forms/LoginForm/useLoginForm.ts'

const {
  form, onSubmit,
} = useLoginForm()
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
      <button
        type="submit"
        :disabled="!(form.email && form.password)"
      >
        login
      </button>
    </div>
  </form>
</template>

<style scoped></style>
