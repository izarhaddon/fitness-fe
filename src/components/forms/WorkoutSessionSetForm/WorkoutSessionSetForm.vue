// src/components/forms/WorkoutSessionSetForm/WorkoutSessionSetForm.vue

<script setup lang="ts">
import { ref } from 'vue'

import { api } from '@/utils/api.ts'
import {
  getErrorMessage,
  unwrap,
} from '@/utils/apiError'
import UITextInput from '@/components/UITextInput.vue'
import UICheckbox from '@/components/UICheckbox.vue'
import UIButton from '@/components/UIButton.vue'
import UIErrorMessage from '@/components/UIErrorMessage.vue'

const props = withDefaults(
  defineProps<{
    setId: undefined | string
    sessionExerciseId: string
    order: number
  }>(),
  {
    setId: undefined,
    order: 0,
    isCompleted: true,
  },
)

const weight = defineModel(
  'weight',
  {
    default: 0,
  },
)

const repetitions = defineModel(
  'repetitions',
  {
    default: 1,
  },
)

const isCompleted = defineModel(
  'isCompleted',
  {
    default: false,
  },
)

const formError = ref<string | null>(null)

async function onSubmit() {
  formError.value = null

  if (props.setId) {
    try {
      await unwrap(api.PATCH(
        '/workout-sessions/set',
        {
          body: {
            setId: props.setId,
            order: props.order,
            weight: weight.value,
            repetitions: repetitions.value,
            isCompleted: isCompleted.value,
          },
        },
      ))
    }
    catch (err) {
      formError.value = getErrorMessage(
        err,
        'Ошибка при обновлении подхода',
      )
    }
  }
  else {
    try {
      await unwrap(api.POST(
        '/workout-sessions/set',
        {
          body: {
            sessionExerciseId: props.sessionExerciseId,
            order: props.order,
            weight: weight.value,
            repetitions: repetitions.value,
            isCompleted: isCompleted.value,
          },
        },
      ))
    }
    catch (err) {
      formError.value = getErrorMessage(
        err,
        'Ошибка при создании подхода',
      )
    }
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UIErrorMessage :message="formError" />

    <UITextInput
      :id="`weight-${sessionExerciseId}`"
      label="Вес"
      name="weight"
      type="number"
      disabled
      v-model:value="weight"
    />

    <UITextInput
      :id="`repetitions-${sessionExerciseId}`"
      label="Повторения"
      name="repetitions"
      type="number"
      disabled
      v-model:value="repetitions"
    />

    <div class="workout-session-exercise__button">
      <UICheckbox
        id="isCompleted"
        label="label"
        name="isCompleted"
        v-model:value="isCompleted"
      />
    </div>

    <UIButton type="submit">UIButton</UIButton>
  </form>
</template>
