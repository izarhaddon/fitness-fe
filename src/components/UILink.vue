<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  href: string
  target?: string
  rel?: string
  icon?: boolean
}>()

const isOuterLink = computed(() => {
  return props.href.startsWith('http://') || props.href.startsWith('https://')
})

const computedTarget = computed(() => {
  if (isOuterLink.value) {
    return props.target || '_blank'
  }
  return props.target
})

const computedRel = computed(() => {
  if (isOuterLink.value) {
    return props.rel || 'noopener noreferrer'
  }
  return props.rel
})
</script>

<template>
  <a
    v-if="isOuterLink"
    :href="href"
    :target="computedTarget"
    :rel="computedRel"
    class="app-link"
    :class="{'app-link--external': props.icon}"
  >
    <slot />
  </a>

  <RouterLink
    v-else
    :to="href"
    class="app-link app-link--internal"
  >
    <slot />
  </RouterLink>
</template>

<style scoped>
.app-link {
  color: var(--n-primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.app-link:hover {
  color: var(--n-primary-color-hover);
  text-decoration: underline;
}

.app-link:active {
  color: var(--n-primary-color-pressed);
}

.app-link--external::after {
  content: ' ↗';
  font-size: 0.85em;
  opacity: 0.7;
}
</style>
