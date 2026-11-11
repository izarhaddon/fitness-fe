// src/components/UIModal/UIModal.vue

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import {
  inject,
  useTemplateRef,
} from 'vue'
import { UI_MODAL_INTERFACE_KEY } from '@/components/UIModalProvider/types'
import type { UIModalInterface } from '@/composables/useModal'

const modalInterface = inject<UIModalInterface>(UI_MODAL_INTERFACE_KEY)

if (!modalInterface) {
  throw new Error('UIModal должен использоваться внутри UIModalProvider')
}

const {
  close, isOpen,
} = modalInterface

const target = useTemplateRef('target')

onClickOutside(
  target,
  () => {
    if (target.value) {
      close()
    }
  },
)
</script>

<template>
  <template v-if="isOpen">
    <Teleport to="body">
      <div class="ui-modal__holder">
        <div
          class="ui-modal"
          ref="target"
        >
          <slot />
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style lang="scss" scoped>
.ui-modal__holder {
  width: 100dvw;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background: #0005;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-modal {
  background: #fff;
}
</style>
