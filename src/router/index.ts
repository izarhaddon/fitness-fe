import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import Login from '@/pages/Login/Login.vue'
import Registration from '@/pages/Registration/Registration.vue'
import Exercise from '@/pages/Exercise/Exercise.vue'
import ExerciseCreate from '@/pages/ExerciseCreate/ExerciseCreate.vue'
import Workouts from '@/pages/Workouts/Workouts.vue'
import Workout from '@/pages/Workout/Workout.vue'
import WorkoutCreate from '@/pages/WorkoutCreate/WorkoutCreate.vue'
import Exercises from '@/pages/Exercises/Exercises.vue'

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
      name: 'Login',
      component: Login,
    },
    {
      path: '/workouts',
      name: 'Workouts',
      component: Workouts,
    },
    {
      path: '/workouts/create',
      name: 'WorkoutCreate',
      component: WorkoutCreate,
    },
    {
      path: '/workouts/:workoutId',
      name: 'Workout',
      component: Workout,
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
    },
    {
      path: '/exercises',
      name: 'Exercises',
      component: Exercises,
    },
    {
      path: '/exercises/create',
      name: 'ExerciseCreate',
      component: ExerciseCreate,
    },
    {
      path: '/exercises/:exerciseId',
      name: 'Exercise',
      component: Exercise,
    },
  ],
})

router.beforeEach((to, from) => {

})

export default router
