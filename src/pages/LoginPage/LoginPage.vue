// src/pages/LoginPage/LoginPage.vue

<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm/LoginForm.vue'
</script>

<template>
  <div class="login-page">
    <div class="login-page__form-holder">
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--n-color);
}

.login-page__form-holder {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
}
</style>
