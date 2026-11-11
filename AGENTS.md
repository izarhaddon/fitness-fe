# Правила для ИИ-агентов — frontend (Fitness Project)

> **Единый источник правил для всех ИИ-агентов** (Claude Code, Qwen Code, Cursor, Codex, Copilot и др.) в этом репозитории.
> - `CLAUDE.md` и `QWEN.md` только подключают этот файл. Правила в них не пиши.
> - Разделы, помеченные «(общее)», продублированы в `../fitness-be/AGENTS.md` — меняешь их здесь, обнови и там.

## 0. Репозиторий
- `fitness-fe` — frontend. Бэкенд живёт в соседнем репозитории `../fitness-be`.
- Типы API генерируются из бэкенда: `npm run generate:types` (`../fitness-be/openapi.json` → `src/types/api.ts`), запросы через `openapi-fetch`.

## 1. Стек
- Vue 3 (Composition API) + Vite
- Pinia, Vue Router
- VueUse
- openapi-fetch + openapi-typescript
- Zod v4
- date-fns
- Language: TypeScript

## 2. ⚠️ СПЕЦИФИКА ZOD v4
В проекте используется Zod версии 4.x ("zod": "^4.4.3"). Синтаксис отличается от v3:
- `z.enum()`: Принимает объект, а не массив строк.
  ```typescript
  // ✅ Правильно для Zod v4:
  z.enum({ trainer: 'trainer', athlete: 'athlete' })
    
  // ❌ Неправильно (вызовет ошибку TS2769):
  z.enum(['trainer', 'athlete'])
  ```
- Кастомные ошибки: Используется свойство `error`, а не `errorMap`.
  ```typescript
  // ✅ Правильно для Zod v4:
  z.enum({ ... }, { error: 'Неверное значение' })
  
  // ❌ Неправильно:
  z.enum({ ... }, { errorMap: () => ({ message: '...' }) })
  ```
- Обработка ошибок валидации: В Zod v4 объект ZodError не имеет свойства .errors (как в v3). Для получения массива проблем валидации необходимо использовать свойство .issues.
  ```typescript
  // ✅ Правильно для Zod v4:
  const result = loginSchema.safeParse(form)
  if (!result.success) {
    const issues = result.error.issues
  }

  // ❌ Неправильно (вызовет TS2339):
  const issues = result.error.errors
  ```

## Принципы разработки (общее)
- `YAGNI`: не добавляем поля "на будущее".
- `Простота и минимализм`: одна четкая цель лучше диапазона.
- `Разделение этапов`: сначала делаем "План" (конструктор шаблонов), "Факт" (дневник выполнения) будет на втором этапе.
- `Практика важнее теории`: отсекаем то, что не работает в реальных тренировках.

## Бизнес-правила (общее)
- Тренер (role: 'trainer') создает шаблоны тренировок (Workout) и указывает себя как creatorId
- Тренер назначает тренировки спортсменам через WorkoutAssignment (одна тренировка может быть назначена множеству пользователей)
- Спортсмен (role: 'athlete') видит только назначенные ему тренировки
- Спортсмен (role: 'athlete') создает шаблоны тренировок и указывает себя как creatorId
- Спортсмен (role: 'athlete') назначает тренировки сам себе
- Справочник упражнений (Exercise) общий для всех, isActive используется для скрытия устаревших упражнений
- При создании Workout сразу создаются вложенные WorkoutExercise одним запросом (nested create)
- Поле order в WorkoutExercise определяет порядок выполнения упражнений

## Бизнес-правила (раздел "Сессии тренировок")
- Сессия тренировки (WorkoutSession) создается на основе шаблона (Workout) с указанием даты (scheduledAt)
- При создании сессии все упражнения из шаблона (WorkoutExercise) копируются в WorkoutSessionExercise с сохранением порядка (order)
- При создании сессии для каждого упражнения автоматически генерируются подходы (WorkoutSessionSet) в количестве, указанном в шаблоне (sets из WorkoutExercise)
- Начальные значения веса (weight) и повторений (repetitions) в WorkoutSessionSet копируются из шаблона (WorkoutExercise)
- Все подходы при создании сессии имеют статус isCompleted: false
- Статус сессии (status) по умолчанию PLANNED при создании
- Статус меняется на COMPLETED только когда пользователь явно завершает сессию
- Статус может быть изменен на SKIPPED, если пользователь решает пропустить запланированную тренировку
- Поле completedAt заполняется только при переходе в статус COMPLETED
- Пользователь может изменять фактические значения weight и repetitions в WorkoutSessionSet во время выполнения тренировки
- Пользователь может добавлять дополнительные подходы в WorkoutSessionSet сверх количества из шаблона
- Пользователь может удалять подходы из WorkoutSessionSet (кроме случая, когда остался только один подход)
- Поле notes в WorkoutSession используется для общих заметок о тренировке (самочувствие, условия и т.д.)
- Поле notes в WorkoutSessionExercise используется для заметок к конкретному упражнению в рамках сессии
- Сессия может быть создана как из назначенной тренировки (WorkoutAssignment), так и напрямую из шаблона
- При удалении шаблона тренировки (Workout) все связанные сессии (WorkoutSession) удаляются каскадно (onDelete: Cascade)
- При удалении сессии (WorkoutSession) все связанные упражнения (WorkoutSessionExercise) и подходы (WorkoutSessionSet) удаляются каскадно

## Известные ограничения (общее)
- НЕ добавляем restTime (время отдыха) в WorkoutExercise - это динамическая величина
- НЕ используем repsMin/repsMax - только одно поле repetitions (точное число повторений)
- НЕ добавляем category или muscleGroupId в Exercise - упрощаем справочник
- НЕ дублируем name/description из Exercise в WorkoutExercise - подтягиваем через связь
- НЕ делаем isActive в WorkoutExercise - если упражнение удаляется из тренировки, удаляется вся запись

## Стиль кода
- `TypeScript` (строгая типизация, избегаем any)
- `ID` везде String (UUID), НЕ Int
- Поле называется `repetitions`, НЕ `reps`
- Файл сверху подписан `// путь до файла/имя файла.расширение файла`, и одна пустая строка
- Запрет на сокращения: Никогда не использовать комментарии вида // ... остальной код или // ... другие поля. Выдавать 100% полный листинг файла.
- БЭМ, используется в названиях классов
- Когда перечисляем делать вот так в vue шаблонах 
  ```vue
  // ✅ Правильно:
  v-for="(entity, entityIndex) in entities"
  :key="entityIndex"
  
  // ❌ Неправильно:
  v-for="(entity, index) in entities"
  :key="index"
  ```
- Использовать defineModel во Vue если есть возможность
- Не пиши сокращенных путей
  ```vue
  // ✅ Правильно:
  import type { WorkoutExerciseForm } from '@/components/forms/WorkoutForm/composables/useWorkoutForm'
  import WorkoutFormExerciseCard from '@/components/forms/WorkoutForm/components/WorkoutFormExerciseCard.vue'
  
  // ❌ Неправильно:
  import type { WorkoutExerciseForm } from '../useWorkoutForm'
  import WorkoutFormExerciseCard from './WorkoutFormExerciseCard.vue'
  ```
- Типы API не пишем руками — берём из `src/types/api.ts` (генерируется `npm run generate:types` из `../fitness-be/openapi.json`, руками не редактируется).

## Импорты
- Группировать импорты: сначала внешние библиотеки, затем внутренние алиасы (@/), затем типы.

---

## Архитектура проекта

### Сущности (общее)

#### Role
- `id` (String, UUID)
- `name` (String) - отображаемое имя ("Администратор", "Тренер", "Спортсмен")
- `slug` (String, unique) - идентификатор для кода ("admin", "trainer", "athlete")
- Связи: один Role -> много User

#### User
- `id` (String, UUID)
- `email` (String, unique)
- `password` (String) - хэш пароля
- `name` (String)
- `roleId` (String, FK -> Role)
- `createdAt`, `updatedAt` (DateTime)
- Связи:
    - один User -> одна Role
    - один User -> много Workout (как creator)
    - один User -> много WorkoutAssignment (как athlete)

#### Exercise (справочник упражнений)
- `id` (String, UUID)
- `name` (String)
- `description` (String, optional)
- `isActive` (Boolean, default: true)
- `createdAt`, `updatedAt` (DateTime)
- Связи: один Exercise -> много WorkoutExercise
- **Важно**: НЕ содержит repetitions/sets/weight - это настраивается в WorkoutExercise

#### Workout (шаблон тренировки)
- `id` (String, UUID)
- `name` (String)
- `description` (String, optional)
- `isActive` (Boolean, default: true)
- `creatorId` (String, FK -> User) - кто создал тренировку
- `createdAt`, `updatedAt` (DateTime)
- Связи:
    - один Workout -> много WorkoutExercise (с каскадным удалением)
    - один Workout -> много WorkoutAssignment (с каскадным удалением)

#### WorkoutExercise (упражнение в тренировке)
- `id` (String, UUID)
- `workoutId` (String, FK -> Workout)
- `exerciseId` (String, FK -> Exercise)
- `order` (Int) - порядок выполнения (1, 2, 3...)
- `sets` (Int) - количество подходов
- `repetitions` (Int) - количество повторений
- `weight` (Float, default: 0.0) - вес (0 если собственный вес)
- `createdAt`, updatedAt (DateTime)
- Связи:
  - много WorkoutExercise -> один Workout (каскадное удаление)
  - много WorkoutExercise -> один Exercise
- Важно: НЕ содержит restTime, notes, repsMin/repsMax

#### WorkoutAssignment (назначение тренировки пользователю)
- `id` (String, UUID)
- `workoutId` (String, FK -> Workout)
- `userId` (String, FK -> User)
- `assignedAt` (DateTime)
- Уникальность: одна тренировка может быть назначена пользователю только один раз (@@unique([workoutId, userId]))
- Связи:
    - много WorkoutAssignment -> один Workout (каскадное удаление)
    - много WorkoutAssignment -> один User

### Пример структуры данных (JSON)

При запросе Workout с вложенными упражнениями:

```json
{
  "id": "uuid-workout",
  "name": "День ног",
  "description": "Тяжелая тренировка",
  "isActive": true,
  "creatorId": "uuid-trainer",
  "exercises": [
    {
      "id": "uuid-we-1", 
      "order": 1,
      "sets": 4,
      "repetitions": 8,
      "weight": 100.0,
      "exercise": {
        "id": "uuid-exercise",
        "name": "Приседания со штангой",
        "description": "Техника..."
      }
    }
  ]
}
```

### Каскадное удаление
- При удалении Workout удаляются все связанные WorkoutExercise, WorkoutAssignment и WorkoutSession (вместе с их упражнениями и подходами)
- При удалении Exercise НЕ удаляются WorkoutExercise (защита от потери истории)

### Соглашения по именованию
- **TypeScript / JSON**: Все поля в ответах и запросах строго в `camelCase` (например, `workoutId`, `repetitions`).
- **Переменные**: `camelCase` для переменных и функций, `PascalCase` для интерфейсов и типов.
- **ID**: Везде используется тип `String` (UUID). Использование `Int` или `Number` для ID запрещено.

### Матрица прав доступа (общее)
| Роль (slug) | Exercise (Справочник) | Workout (Шаблоны) | WorkoutAssignment (Назначения) |
|-------------|-----------------------|-------------------|--------------------------------|
| `admin`     | CRUD (полный доступ)  | CRUD (все)        | Просмотр всех                  |
| `trainer`   | Read (только чтение)  | CRUD (только свои, где creatorId = свой ID) | Create (назначать спортсменам), Read (свои назначения) |
| `athlete`   | Read (только чтение)  | Read (только назначенные ему или созданные им самим), Create (свои личные) | Read (только свои) |

### Стандарты API-ответов (что приходит с бэкенда)
- **Успешный ответ (200/201)**: Возвращает данные напрямую или в объекте `{ data: ..., pagination: ... }`.
- **Ошибка (4xx/5xx)**: Строго в формате `{ "error": "Текст ошибки на русском" }`. Никаких полей `message` или `errors`.
- **Пагинация**: Всегда возвращается как объект `pagination: { page, limit, total, totalPages }` на одном уровне с `data`.
- **Даты**: Все поля `createdAt`/`updatedAt`/`assignedAt` приходят в формате ISO 8601 (строка).
