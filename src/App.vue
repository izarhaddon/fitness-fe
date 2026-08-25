<script setup lang="ts">
import { useDark } from '@vueuse/core'
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  darkTheme,
  ruRU,
  dateRuRU,
} from 'naive-ui'

import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout.vue'
import LoginLayout from '@/layouts/LoginLayout/LoginLayout.vue'
import { useAuthStore } from '@/stores/auth.store.ts'

const isDark = useDark()
const authStore = useAuthStore()

const isAuthenticated = authStore.isAuthenticated
</script>

<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : null"
    :locale="ruRU"
    :date-locale="dateRuRU"
  >
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <DefaultLayout v-if="isAuthenticated" />
          <LoginLayout v-else />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
