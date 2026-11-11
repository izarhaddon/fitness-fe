// src/composables/useModal.ts

import {
  type Ref,
  ref,
} from 'vue'

export interface UIModalInterface {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(): UIModalInterface {
  const isOpen = ref(false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    open: open,
    close: close,
    toggle: toggle,
  }
}
