import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage/LoginPage.vue'
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage.vue'
import ExerciseEditPage from '@/pages/ExerciseEditPage/ExerciseEditPage.vue'
import ExercisePage from '@/pages/ExercisePage/ExercisePage.vue'
import ExerciseCreatePage from '@/pages/ExerciseCreatePage/ExerciseCreatePage.vue'
import WorkoutsPage from '@/pages/WorkoutsPage/WorkoutsPage.vue'
import WorkoutPage from '@/pages/WorkoutPage/WorkoutPage.vue'
import WorkoutEditPage from '@/pages/WorkoutEditPage/WorkoutEditPage.vue'
import WorkoutCreatePage from '@/pages/WorkoutCreatePage/WorkoutCreatePage.vue'
import ExercisesPage from '@/pages/ExercisesPage/ExercisesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/workouts',
      name: 'WorkoutsPage',
      component: WorkoutsPage,
    },
    {
      path: '/workouts/create',
      name: 'WorkoutCreatePage',
      component: WorkoutCreatePage,
    },
    {
      path: '/workouts/:workoutId',
      name: 'Workout',
      component: WorkoutPage,
    },
    {
      path: '/workouts/:workoutId/edit',
      name: 'WorkoutEdit',
      component: WorkoutEditPage,
    },
    {
      path: '/registration',
      name: 'RegistrationPage',
      component: RegistrationPage,
    },
    {
      path: '/exercises',
      name: 'ExercisesPage',
      component: ExercisesPage,
    },
    {
      path: '/exercises/create',
      name: 'ExerciseCreatePage',
      component: ExerciseCreatePage,
    },
    {
      path: '/exercises/:exerciseId',
      name: 'Exercise',
      component: ExercisePage,
    },
    {
      path: '/exercises/:exerciseId/edit',
      name: 'ExerciseEdit',
      component: ExerciseEditPage,
    },
  ],
})

export default router
