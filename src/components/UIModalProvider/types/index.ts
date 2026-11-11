import { type InjectionKey } from 'vue'
import type { UIModalInterface } from '@/composables/useModal.ts'

export const UI_MODAL_INTERFACE_KEY: InjectionKey<UIModalInterface> = Symbol('UI_MODAL_INTERFACE')
