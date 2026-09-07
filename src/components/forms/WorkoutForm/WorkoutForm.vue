// src/components/forms/WorkoutForm/WorkoutForm.vue

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import { api } from '@/utils/api'
import { workoutSchema } from '@/components/forms/WorkoutForm/schemas'
import type {
  Workout,
  WorkoutExerciseItemInput,
  Exercise,
} from '@/components/forms/WorkoutForm/types'
import UIButton from '@/components/UIButton.vue'

const props = defineProps<{
  initialData?: Workout
}>()

const emit = defineEmits<{
  success: []
}>()

const isEditMode = computed(() => !!props.initialData?.id)

const name = ref<string>(props.initialData?.name ?? '')
const description = ref<string>(props.initialData?.description ?? '')
const isActive = ref<boolean>(props.initialData?.isActive ?? true)

const initializeExercises = (): WorkoutExerciseItemInput[] => {
  if (props.initialData?.exercises && props.initialData.exercises.length > 0) {
    return props.initialData.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      order: ex.order,
      sets: ex.sets,
      repetitions: ex.repetitions,
      weight: ex.weight,
    }))
  }

  return [
    {
      exerciseId: '',
      order: 1,
      sets: 0,
      repetitions: 0,
      weight: 0,
    },
  ]
}

const exercises = ref<WorkoutExerciseItemInput[]>(initializeExercises())
const formError = ref<string | null>(null)
const isLoading = ref<boolean>(false)

const availableExercises = ref<Exercise[]>([])

onMounted(async () => {
  try {
    const response = await api.GET(
      '/exercises',
      {
        params: {
          query: {
            limit: 100,
          },
        },
      },
    )
    if (response.data) {
      availableExercises.value = response.data.data.filter(ex => ex.isActive)
    }
  }
  catch (error) {
    console.error(
      'Не удалось загрузить список упражнений:',
      error,
    )
  }
})

const addExercise = () => {
  const nextOrder
    = exercises.value.length > 0 ? Math.max(...exercises.value.map(e => e.order)) + 1 : 1

  exercises.value.push({
    exerciseId: '',
    order: nextOrder,
    sets: 0,
    repetitions: 0,
    weight: 0,
  })
}

const removeExercise = (index: number) => {
  if (exercises.value.length > 1) {
    exercises.value.splice(
      index,
      1,
    )
  }
}

const onSubmit = async () => {
  formError.value = null

  const result = workoutSchema.safeParse({
    name: name.value,
    description: description.value,
    isActive: isActive.value,
    exercises: exercises.value,
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
        '/workouts/{id}',
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
        formError.value = error.error || 'Ошибка при обновлении тренировки'
        return
      }
    }
    else {
      const { error } = await api.POST(
        '/workouts',
        {
          body: result.data,
        },
      )

      if (error) {
        formError.value = error.error || 'Ошибка при создании тренировки'
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
    <p v-if="formError">
      {{ formError }}
    </p>

    <fieldset>
      <legend>Основная информация</legend>

      <label for="name">Название тренировки</label>
      <input
        id="name"
        v-model="name"
        type="text"
        name="name"
        placeholder="День ног"
        :disabled="isLoading"
        required
      />

      <label for="description">Описание (необязательно)</label>
      <textarea
        id="description"
        v-model="description"
        name="description"
        placeholder="Тяжелая тренировка на низ"
        :disabled="isLoading"
        rows="3"
      ></textarea>

      <label>
        <input
          v-model="isActive"
          type="checkbox"
          name="isActive"
          :disabled="isLoading"
        />
        Активна (видна в справочнике)
      </label>
    </fieldset>

    <fieldset>
      <legend>Упражнения</legend>

      <div
        v-for="(ex, index) in exercises"
        :key="index"
      >
        <div>
          <strong>Упражнение #{{ index + 1 }}</strong>
          <button
            type="button"
            @click="removeExercise(index)"
            :disabled="isLoading || exercises.length <= 1"
          >
            Удалить
          </button>
        </div>

        <label :for="`exerciseId-${index}`">Упражнение</label>
        <select
          :id="`exerciseId-${index}`"
          v-model="ex.exerciseId"
          :disabled="isLoading"
          required
        >
          <option
            value=""
            disabled
          >
            Выберите упражнение...
          </option>
          <option
            v-for="availEx in availableExercises"
            :key="availEx.id"
            :value="availEx.id"
          >
            {{ availEx.name }}
          </option>
        </select>

        <div>
          <div>
            <label :for="`order-${index}`">Порядок</label>
            <input
              :id="`order-${index}`"
              v-model.number="ex.order"
              type="number"
              min="1"
              :disabled="isLoading"
              required
            />
          </div>
          <div>
            <label :for="`sets-${index}`">Подходы</label>
            <input
              :id="`sets-${index}`"
              v-model.number="ex.sets"
              type="number"
              min="0"
              :disabled="isLoading"
              required
            />
          </div>
          <div>
            <label :for="`reps-${index}`">Повторения</label>
            <input
              :id="`reps-${index}`"
              v-model.number="ex.repetitions"
              type="number"
              min="0"
              :disabled="isLoading"
              required
            />
          </div>
          <div>
            <label :for="`weight-${index}`">Вес (кг)</label>
            <input
              :id="`weight-${index}`"
              v-model.number="ex.weight"
              type="number"
              min="0"
              step="0.5"
              :disabled="isLoading"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addExercise"
        :disabled="isLoading"
      >
        + Добавить упражнение
      </button>
    </fieldset>

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
              : 'Создать тренировку'
        }}
      </UIButton>

      <router-link :to="{ name: 'WorkoutsPage' }">Назад</router-link>
    </div>
  </form>
</template>
