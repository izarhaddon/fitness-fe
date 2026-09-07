// src/components/UIDuration.vue

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

const props = withDefaults(
  defineProps<{
    duration: number
    autoStart?: boolean
  }>(),
  {
    autoStart: true,
  },
)

const emits = defineEmits<{
  (e: 'complete'): void
}>()

const isRunning = ref(false)
const startTime = ref<number>(0)
const elapsedTime = ref(0)
let animationFrameId: number | null = null

const progress = computed(() => {
  const remaining = Math.max(
    0,
    props.duration * 1000 - elapsedTime.value,
  )
  return (remaining / (props.duration * 1000)) * 100
})

function updateProgress() {
  if (!isRunning.value) return

  elapsedTime.value = Date.now() - startTime.value

  if (elapsedTime.value >= props.duration * 1000) {
    elapsedTime.value = props.duration * 1000
    isRunning.value = false
    emits('complete')
    return
  }

  animationFrameId = requestAnimationFrame(updateProgress)
}

function start() {
  if (isRunning.value) return

  isRunning.value = true
  startTime.value = Date.now() - elapsedTime.value
  updateProgress()
}

function pause() {
  isRunning.value = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
}

function reset() {
  pause()
  elapsedTime.value = 0
}

onMounted(() => {
  if (props.autoStart) {
    start()
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

defineExpose({
  start,
  pause,
  reset,
})
</script>

<template>
  <div class="ui-duration">
    <div class="ui-duration__bar">
      <div
        class="ui-duration__fill"
        :style="`width: ${progress}%`"
      />
    </div>
  </div>
</template>

<style scoped>
.ui-duration {
  width: 100%;
}

.ui-duration__bar {
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ui-duration__fill {
  height: 100%;
  background: green;
  transition:
    width 0.1s linear,
    background-color 0.3s ease;
}
</style>
