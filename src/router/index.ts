// src/router/index.ts

import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
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

// Расширяем типы Vue Router для поддержки наших meta-полей
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresRole?: 'admin' | 'trainer' | 'athlete'
  }
}

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
      name: 'Workout',
      component: WorkoutPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workouts/:workoutId/edit',
      name: 'WorkoutEdit',
      component: WorkoutEditPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/exercises',
      name: 'ExercisesPage',
      component: ExercisesPage,
      // Справочник может быть доступен всем, но создание - только авторизованным
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
      name: 'Exercise',
      component: ExercisePage,
    },
    {
      path: '/exercises/:exerciseId/edit',
      name: 'ExerciseEdit',
      component: ExerciseEditPage,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

// Глобальный мидлвеир (Navigation Guard)
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 1. КРИТИЧНО: Ждем инициализации стора.
  // Это решает проблему F5, когда токен есть в localStorage,
  // но запрос на /api/auth/me еще не завершился.
  await authStore.init()

  const isAuthenticated = authStore.isAuthenticated

  // 2. Если маршрут требует авторизации, а пользователь не авторизован
  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'LoginPage',
      query: {
        redirect: to.fullPath,
      }, // Сохраняем путь, чтобы вернуть юзера после логина
    }
  }

  // 3. Если пользователь авторизован, но пытается попасть на страницы входа/регистрации
  if (isAuthenticated && (to.name === 'LoginPage' || to.name === 'RegistrationPage')) {
    return {
      name: 'HomePage',
    }
  }

  // 4. (Опционально) Проверка ролей, если в meta указан requiresRole
  if (to.meta.requiresRole && authStore.user?.roleSlug !== to.meta.requiresRole) {
    return {
      name: 'HomePage',
    } // Или на страницу 403 Forbidden
  }
})

export default router
