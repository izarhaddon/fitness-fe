<script setup lang="ts">
import { api } from '@/utils/api.ts'
import UITextInput from '@/components/UITextInput.vue'
import UICheckbox from '@/components/UICheckbox.vue'
import UIButton from '@/components/UIButton.vue'

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

async function onSubmit() {
  if (props.setId) {
    try {
      const { error } = await api.PATCH(
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
      )
      // openapi-fetch не бросает исключение на 4xx/5xx — ошибку API нужно проверять явно
      if (error) console.error(error.error)
    }
    catch (networkError) {
      console.error(networkError)
    }
  }
  else {
    try {
      const { error } = await api.POST(
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
      )
      // openapi-fetch не бросает исключение на 4xx/5xx — ошибку API нужно проверять явно
      if (error) console.error(error.error)
    }
    catch (networkError) {
      console.error(networkError)
    }
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
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
