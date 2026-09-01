// src/router/index.ts.ts.ts.ts

import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
import WorkoutSessionCreatePage from '@/pages/WorkoutSessionCreatePage/WorkoutSessionCreatePage.vue'
import WorkoutSessionsPage from '@/pages/WorkoutSessionsPage/WorkoutSessionsPage.vue'

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
      path: '/registration',
      name: 'RegistrationPage',
      component: RegistrationPage,
    },
    {
      path: '/workouts',
      name: 'WorkoutsPage',
      component: WorkoutsPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workouts/create',
      name: 'WorkoutCreatePage',
      component: WorkoutCreatePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workouts/:workoutId',
      name: 'WorkoutPage',
      component: WorkoutPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workouts/:workoutId/edit',
      name: 'WorkoutEditPage',
      component: WorkoutEditPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exercises',
      name: 'ExercisesPage',
      component: ExercisesPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exercises/create',
      name: 'ExerciseCreatePage',
      component: ExerciseCreatePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exercises/:exerciseId',
      name: 'ExercisePage',
      component: ExercisePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exercises/:exerciseId/edit',
      name: 'ExerciseEditPage',
      component: ExerciseEditPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workout-sessions/create',
      name: 'WorkoutSessionCreatePage',
      component: WorkoutSessionCreatePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workout-sessions',
      name: 'WorkoutSessionsPage',
      component: WorkoutSessionsPage,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  await authStore.init()

  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'LoginPage',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.requiresRole && authStore.user?.roleSlug !== to.meta.requiresRole) {
    return {
      name: 'HomePage',
    }
  }
})

export default router
