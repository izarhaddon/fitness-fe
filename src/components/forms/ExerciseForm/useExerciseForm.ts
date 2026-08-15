import { reactive } from 'vue'
import { api } from '@/utils/api.ts'

interface UseExerciseFormInterface {
  name: string;
  description: string;
  reps: number,
  sets: number,
  weight: number,
  isActive: boolean,
}

interface UseExerciseFormProps extends UseExerciseFormInterface {}

interface UseExerciseFormPayload {
  form: UseExerciseFormInterface;
  onSubmit: (payload: SubmitEvent) => void;
}

export const useExerciseForm = (props?: UseExerciseFormProps): UseExerciseFormPayload => {
  const form = reactive({
    name: props?.name ?? '',
    description: props?.description ?? '',
    reps: props?.reps ?? 0,
    sets: props?.sets ?? 0,
    weight: props?.weight ?? 0,
    isActive: props?.isActive ?? true,
  })

  function onSubmit() {
    try {
      const data = api.post('/api/exercises', {...form})
      console.log('data', data)
    }
    catch (error) {
      console.error(error)
    }
    finally {
      console.log('finally')
    }
  }

  return { form, onSubmit }
}
