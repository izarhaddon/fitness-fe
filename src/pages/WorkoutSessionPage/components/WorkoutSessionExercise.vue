// src/pages/WorkoutSessionPage/components/WorkoutSessionExercise.vue
<script setup lang="ts">
import {
  inject,
  ref,
} from 'vue'

import type { SessionExercise } from '@/pages/WorkoutSessionPage/types'
import WorkoutSessionSetForm from '@/components/forms/WorkoutSessionSetForm/WorkoutSessionSetForm.vue'
import UIModal from '@/components/UIModal/UIModal.vue'
import { UI_MODAL_INTERFACE_KEY } from '@/components/UIModalProvider/types'
import type { UIModalInterface } from '@/composables/useModal.ts'

const modalInterface = inject<UIModalInterface>(UI_MODAL_INTERFACE_KEY)

if (!modalInterface) {
  throw new Error('UIModal должен использоваться внутри UIModalProvider')
}

const {
  close, open,
} = modalInterface

defineProps<SessionExercise>()

const openedExercises = ref<string[]>([])
const editSet = ref<string | null>(null)

function toggleOpenedExercises(exerciseId: string) {
  if (openedExercises.value.includes(exerciseId)) {
    openedExercises.value = openedExercises.value.filter(id => id !== exerciseId)
  }
  else {
    openedExercises.value = [
      ...openedExercises.value,
      exerciseId,
    ]
  }
}

function toggleEditSet(setId: string) {
  if (editSet.value === setId) {
    editSet.value = null
    close()
  }
  else {
    editSet.value = setId
    open()
  }
}
</script>

<template>
  <div class="workout-session-exercise">
    <div
      class="workout-session-exercise__header"
      @click="toggleOpenedExercises(id)"
    >
      <div class="workout-session-exercise__name">
        {{ exercise.name }}
      </div>
      <i
        class="fa fa-chevron-down"
        aria-hidden="true"
      ></i>
    </div>

    <div
      class="workout-session-exercise__container"
      v-if="openedExercises.includes(id)"
    >
      <div class="workout-session-exercise__sets-holder">
        <div
          v-for="(set, entityIndex) in sets"
          :key="entityIndex"
          class="workout-session-exercise__set"
        >
          <div class="workout-session-exercise__weight__repetitions">
            <div
              class="workout-session-exercise__edit-trigger"
              @click="toggleEditSet(set.id)"
            >
              <i
                class="fa fa-pencil"
                aria-hidden="true"
              />
            </div>

            <WorkoutSessionSetForm
              :setId="set.id"
              :order="set.order"
              :is-completed="set.isCompleted"
              :repetitions="set.repetitions"
              :weight="set.weight"
              :session-exercise-id="exerciseId"
            />
          </div>

          <UIModal v-if="editSet && editSet === set.id">
            <WorkoutSessionSetForm
              :setId="set.id"
              :order="set.order"
              :is-completed="set.isCompleted"
              v-model:repetitions="set.repetitions"
              v-model:weight="set.weight"
              :session-exercise-id="exerciseId"
            />
          </UIModal>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.workout-session-exercise {
  border-radius: 4px;
  border: 1px solid var(--border-color);

  &__header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    background: #f6f6f6;
    gap: 16px;
  }

  &__container {
    border-top: 1px solid var(--border-color);
    padding: 8px;
  }

  &__sets-holder {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    cursor: pointer;
  }

  &__weight__repetitions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
