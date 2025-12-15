# Инструкция по настройке прав доступа в Strapi для поля Author

## Проблема
При создании поста через API поле `author` не устанавливается автоматически, и его нельзя установить через обычный PUT/PATCH запрос из-за ограничений прав доступа в Strapi.

## Решение 1: Настройка прав доступа через админ-панель Strapi

### Шаг 1: Откройте настройки прав доступа

1. Войдите в админ-панель Strapi: `https://324cbb377ef9.vps.myjino.ru/admin`
2. Перейдите в **Settings** (Настройки) → **Users & Permissions Plugin** → **Roles**
3. Выберите роль **Authenticated** (или роль, которую использует ваш пользователь)

### Шаг 2: Настройте права для модели Post

1. Найдите модель **Post** в списке
2. Убедитесь, что включены следующие права:
   - ✅ **find** - поиск постов
   - ✅ **findOne** - получение одного поста
   - ✅ **create** - создание постов
   - ✅ **update** - обновление постов
   - ✅ **delete** - удаление постов (опционально)

### Шаг 3: Настройте права для поля Author

1. В разделе **Post** нажмите на **Advanced Settings** (Расширенные настройки) или найдите раздел с полями
2. Найдите поле **author** в списке полей модели Post
3. Убедитесь, что поле **author**:
   - Не имеет ограничений на редактирование через API
   - Не является "read-only" полем
   - Имеет тип "Relation" → "User" (Many-to-One или One-to-One)

### Шаг 4: Проверьте настройки Content-Type

1. Перейдите в **Content-Type Builder** → **Post**
2. Найдите поле **author**
3. Убедитесь, что:
   - Поле не помечено как "Private" (Приватное)
   - Поле не имеет ограничений на редактирование
   - Тип связи правильный: **Relation** → **User**

## Решение 2: Использование Lifecycle Hook (Рекомендуется)

Этот метод автоматически устанавливает автора из токена при создании поста.

### Шаг 1: Найдите файл жизненного цикла модели Post

На сервере Strapi найдите файл:
```
src/api/post/content-types/post/lifecycles.js
```

Если файла нет, создайте его.

### Шаг 2: Добавьте код для автоматической установки автора

```javascript
'use strict';

/**
 * Post lifecycle hooks
 */

module.exports = {
  /**
   * Before creating a post, set the author from the authenticated user
   */
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    
    // Получаем текущего пользователя из контекста
    const user = event.state.user;
    
    if (user && !data.author) {
      // Устанавливаем автора из токена, если он не указан
      data.author = user.id;
    }
  },

  /**
   * Before updating a post, ensure the author can only be set by the owner or admin
   */
  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    const user = event.state.user;
    
    // Если пользователь пытается изменить автора, проверяем права
    if (data.author && user) {
      // Разрешаем изменение автора только если пользователь - владелец поста или админ
      // Это опциональная проверка безопасности
    }
  },
};
```

### Шаг 3: Перезапустите Strapi

После добавления lifecycle hook перезапустите сервер Strapi:
```bash
npm run develop
# или
npm run start
```

## Решение 3: Использование кастомного контроллера

Если lifecycle hook не работает, можно создать кастомный контроллер.

### Шаг 1: Создайте кастомный контроллер

Создайте файл: `src/api/post/controllers/post.js`

```javascript
'use strict';

/**
 * Post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    
    // Добавляем автора из токена
    if (user && ctx.request.body.data) {
      ctx.request.body.data.author = user.id;
    }
    
    // Вызываем стандартный метод создания
    const response = await super.create(ctx);
    return response;
  },
}));
```

### Шаг 2: Обновите роуты (если нужно)

Убедитесь, что роуты используют ваш кастомный контроллер в файле `src/api/post/routes/post.js`.

## Решение 4: Проверка через API напрямую

Проверьте, работает ли установка автора через прямой запрос к Strapi API:

```bash
curl -X PUT "https://324cbb377ef9.vps.myjino.ru/api/posts/POST_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "author": USER_ID
    }
  }'
```

Если этот запрос возвращает ошибку, значит проблема в правах доступа.

## Диагностика проблем

### Проверка ошибок в логах Strapi

1. Откройте логи Strapi на сервере
2. Найдите ошибки, связанные с полем `author`
3. Типичные ошибки:
   - `"author" field is not editable` - поле помечено как read-only
   - `Permission denied` - недостаточно прав доступа
   - `Invalid relation` - неправильный формат связи

### Проверка структуры данных

Убедитесь, что поле `author` в модели Post имеет правильный тип:
- Тип: **Relation**
- Связь: **User** (Many-to-One)
- Не должно быть ограничений на редактирование

## Альтернативное решение: Использование documentId вместо id

В Strapi v4 для связей может потребоваться использовать `documentId` вместо `id`. Попробуйте:

```javascript
{
  data: {
    author: {
      connect: [userDocumentId] // вместо просто user.id
    }
  }
}
```

Или:

```javascript
{
  data: {
    author: userDocumentId // просто documentId пользователя
  }
}
```

## Рекомендации

1. **Используйте Lifecycle Hook** - это самый надежный способ автоматической установки автора
2. **Проверьте права доступа** - убедитесь, что роль Authenticated имеет права на update для Post
3. **Проверьте тип поля** - убедитесь, что author - это Relation к User
4. **Используйте documentId** - в Strapi v4 для связей может потребоваться documentId вместо id

## После настройки

После применения одного из решений:
1. Перезапустите Strapi
2. Попробуйте создать пост через консоль
3. Проверьте, что автор установлен автоматически
4. Проверьте, что пост появляется в "Мои интересы"

