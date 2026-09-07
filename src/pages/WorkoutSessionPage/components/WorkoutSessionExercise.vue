// src/pages/WorkoutSessionPage/components/WorkoutSessionExercise.vue

<script setup lang="ts">
import type { SessionExercise } from '@/pages/WorkoutSessionPage/types'
import { ref } from 'vue'

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
  }
  else {
    editSet.value = setId
  }
}
</script>

<template>
  <div class="workout-session-exercise">
    <p
      @click="toggleOpenedExercises(id)"
      style="cursor: pointer"
    >
      {{ exercise.name }}
    </p>

    <template v-if="openedExercises.includes(id)">
      <div
        v-for="(set, setIndex) in sets"
        :key="setIndex"
      >
        <div @click="toggleEditSet(set.id)">
          <i
            class="fa fa-pencil"
            aria-hidden="true"
          />
        </div>

        <template v-if="editSet === set.id">
          <div>
            <label>Вес</label>
            <input
              v-model.number="set.weight"
              type="number"
              min="0"
            />
          </div>

          <div>
            <label>Повторения</label>
            <input
              v-model.number="set.repetitions"
              type="number"
              min="0"
            />
          </div>
        </template>

        <template v-else>
          <div>
            <p>
              Вес: <strong>{{ set.weight }}</strong>
            </p>
            <p>
              Повторы: <strong>{{ set.repetitions }}</strong>
            </p>
          </div>
        </template>

        <label :for="set.id">
          <input
            :id="set.id"
            type="checkbox"
            v-model="set.isCompleted"
          />
        </label>
      </div>
    </template>
  </div>
</template>
