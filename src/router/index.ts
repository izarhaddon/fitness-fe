import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AdminExercise from '@/pages/AdminExercise/AdminExercise.vue'
import AdminExercises from '@/pages/AdminExercises/AdminExercises.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/admin',
      redirect: {
        name: 'AdminExercises',
      },
    },
    {
      path: '/admin/exercises',
      name: 'AdminExercises',
      component: AdminExercises,
    },
    {
      path: '/admin/exercises/:exerciseId',
      name: 'AdminExercise',
      component: AdminExercise,
    },
  ],
})

export default router
