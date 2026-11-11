// src/components/UIModalProvider.vue

<script setup lang="ts">
import {
  type UIModalInterface,
  useModal,
} from '@/composables/useModal.ts'
import { provide } from 'vue'
import { UI_MODAL_INTERFACE_KEY } from '@/components/UIModalProvider/types'

const {
  isOpen, open, toggle, close,
} = useModal()

provide<UIModalInterface>(
  UI_MODAL_INTERFACE_KEY,
  {
    isOpen,
    open,
    toggle,
    close,
  },
)
</script>

<template>
  <slot />
</template>
