// src/pages/RegistrationPage/RegistrationPage.vue

<script setup lang="ts">
import RegistrationForm from '@/components/forms/RegistrationForm/RegistrationForm.vue'
</script>

<template>
  <div class="registration-page">
    <div class="registration-page__form-holder">
      <RegistrationForm />
    </div>
  </div>
</template>

<style scoped>
.registration-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--n-color);
}

.registration-page__form-holder {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
}
</style>
