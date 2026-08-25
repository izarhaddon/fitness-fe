<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  NLayoutHeader,
  NMenu,
  NButton,
  NIcon,
  NDrawer,
  NDrawerContent,
  type MenuOption,
} from 'naive-ui'
import {
  useMediaQuery,
  useToggle,
} from '@vueuse/core'
import { MenuOutline } from '@vicons/ionicons5'

const router = useRouter()

const isDesktop = useMediaQuery('(min-width: 768px)')

const [
  showDrawer,
  toggleDrawer,
] = useToggle(false)

const menuOptions: MenuOption[] = [
  {
    label: 'Главная',
    key: 'HomePage',
  },
  {
    label: 'Тренировки',
    key: 'workouts-group',
    children: [
      {
        label: 'Все тренировки',
        key: 'WorkoutsPage',
      },
      {
        label: 'Создать тренировку',
        key: 'WorkoutCreatePage',
      },
    ],
  },
  {
    label: 'Упражнения',
    key: 'exercises-group',
    children: [
      {
        label: 'Справочник упражнений',
        key: 'ExercisesPage',
      },
      {
        label: 'Добавить упражнение',
        key: 'ExerciseCreatePage',
      },
    ],
  },
  {
    label: 'Аккаунт',
    key: 'auth-group',
    children: [
      {
        label: 'Вход',
        key: 'LoginPage',
      },
      {
        label: 'Регистрация',
        key: 'RegistrationPage',
      },
    ],
  },
]

// Строгая типизация аргумента key (избегаем any)
const handleMenuClick = (key: string) => {
  showDrawer.value = false

  // Реальная навигация через Vue Router
  if (key) {
    router
      .push({
        name: key,
      })
      .catch(() => {
        // Игнорируем ошибки навигации на тот же маршрут
      })
  }
}

// Автоматически закрываем меню при переходе на десктопный размер
watch(
  isDesktop,
  (newVal) => {
    if (newVal) {
      showDrawer.value = false
    }
  },
)
</script>

<template>
  <NLayoutHeader
    bordered
    class="app-header"
  >
    <div class="header-content">
      <div class="logo">Fitness App</div>

      <!-- Десктопное меню -->
      <NMenu
        v-if="isDesktop"
        mode="horizontal"
        :options="menuOptions"
        class="desktop-menu"
      />

      <!-- Мобильный бургер -->
      <NButton
        v-else
        quaternary
        circle
        size="large"
        @click="toggleDrawer()"
        aria-label="Открыть меню"
      >
        <template #icon>
          <NIcon :size="24">
            <MenuOutline />
          </NIcon>
        </template>
      </NButton>
    </div>
  </NLayoutHeader>

  <!-- Выезжающее меню для мобильных -->
  <NDrawer
    v-model:show="showDrawer"
    placement="left"
    :width="280"
    :auto-focus="false"
  >
    <NDrawerContent
      title="Навигация"
      closable
    >
      <NMenu
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.app-header {
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--n-color);
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--n-text-color);
}

.desktop-menu {
  flex: 1;
  justify-content: flex-end;
  background: transparent !important;
}
</style>
