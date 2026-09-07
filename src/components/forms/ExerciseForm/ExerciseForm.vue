// src/components/forms/ExerciseForm/ExerciseForm.vue

<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { api } from '@/utils/api'
import { exerciseSchema } from '@/components/forms/ExerciseForm/schemas'
import type { Exercise } from '@/components/forms/ExerciseForm/types'
import UIButton from '@/components/UIButton.vue'
import UITextInput from '@/components/UITextInput.vue'
import UITextArea from '@/components/UITextArea.vue'

const props = defineProps<{
  initialData?: Exercise
}>()

const emit = defineEmits<{
  success: []
}>()

const isEditMode = computed(() => !!props.initialData?.id)

const name = ref<string>(props.initialData?.name ?? '')
const description = ref<string>(props.initialData?.description ?? '')
const isActive = ref<boolean>(props.initialData?.isActive ?? true)
const formError = ref<string | null>(null)
const isLoading = ref<boolean>(false)

const onSubmit = async () => {
  formError.value = null

  const result = exerciseSchema.safeParse({
    name: name.value,
    description: description.value,
    isActive: isActive.value,
  })

  if (!result.success) {
    const firstIssue = result.error.issues[0]
    formError.value = firstIssue?.message || 'Ошибка валидации данных'
    return
  }

  try {
    isLoading.value = true

    if (isEditMode.value && props.initialData) {
      const { error } = await api.PUT(
        '/exercises/{id}',
        {
          params: {
            path: {
              id: props.initialData.id,
            },
          },
          body: result.data,
        },
      )

      if (error) {
        formError.value = error.error || 'Ошибка при обновлении упражнения'
        return
      }
    }
    else {
      const { error } = await api.POST(
        '/exercises',
        {
          body: result.data,
        },
      )

      if (error) {
        formError.value = error.error || 'Ошибка при создании упражнения'
        return
      }
    }

    emit('success')
  }
  catch {
    formError.value = 'Произошла непредвиденная ошибка сети'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <p v-if="formError">
        {{ formError }}
      </p>
    </div>

    <UITextInput
      id="name"
      label="Название упражнения"
      name="name"
      v-model:value="name"
    />

    <UITextArea
      id="description"
      label="Описание (необязательно)"
      name="description"
      v-model:value="description"
    />

    <div>
      <label>
        <input
          v-model="isActive"
          type="checkbox"
          name="isActive"
          :disabled="isLoading"
        />
        Активно (видно в справочнике)
      </label>
    </div>

    <div>
      <UIButton
        type="submit"
        :disabled="isLoading"
      >
        {{
          isLoading
            ? isEditMode
              ? 'Сохранение...'
              : 'Создание...'
            : isEditMode
              ? 'Сохранить изменения'
              : 'Создать упражнение'
        }}
      </UIButton>
      <router-link :to="{ name: 'ExercisesPage' }">Назад</router-link>
    </div>
  </form>
</template>
