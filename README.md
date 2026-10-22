# Blockclient

Фронтенд личного блога на **Nuxt 3** с бэкендом **Strapi CMS**.  
Портфолио-проект: лендинг, лента постов, комментарии, профиль, админ-консоль редактора и настройки блога.

## Стек

- Nuxt 3 + Vue 3
- Pinia (с persisted state)
- Tailwind CSS 4
- Strapi (отдельный API; в этом репозитории — клиент и Nitro API-прокси)
- PM2 / GitHub Actions для деплоя

## Возможности

- Главная с кастомным фоном и редактируемым текстом блокнота
- Блог: список постов, категории, поиск, страница поста с комментариями
- Консоль (`/console`) — создание и редактирование постов (для роли content-admin)
- Настройки блога (`/settings`) — название, фон, статистика просмотров
- Контакты в виде «блокнота» с редактированием записей
- Загрузка медиа через Nitro → Strapi `/upload`

## Требования

- Node.js **18–22** (см. `.nvmrc`: `22`)
- Работающий экземпляр Strapi с API постов, категорий, комментариев, пользователей и `config`

## Быстрый старт

```bash
# 1. Версия Node
nvm use   # или установите Node 22

# 2. Зависимости
npm install

# 3. Окружение
cp .env.example .env
# Укажите URL вашего Strapi:
# NUXT_PUBLIC_STRAPI_URL=https://your-strapi-host.example

# 4. Dev-сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Переменные окружения

| Переменная | Описание |
|---|---|
| `NUXT_PUBLIC_STRAPI_URL` | Базовый URL Strapi (без `/` в конце). Доступен на клиенте и сервере. |
| `STRAPI_URL` | Опциональный серверный override; если не задан — используется `NUXT_PUBLIC_STRAPI_URL`. |

Если переменные не заданы, используется URL продакшен-Strapi по умолчанию (см. `utils/strapiBase.js`).

## Скрипты

| Команда | Назначение |
|---|---|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка |
| `npm run preview` | Локальный просмотр сборки |
| `npm start` | Запуск production-сервера Nuxt |
| `npm run clean` | Удалить `.output` |
| `npm run clean:all` | Очистить кэш Nuxt / Nitro |

Перед `dev`/`build` автоматически очищается каталог `.output` (`predev` / `prebuild`), чтобы избежать ошибок очистки Nitro.

## Структура (кратко)

```
pages/           # маршруты (blog, console, settings, post, …)
components/      # UI: навбар, редактор поста, формы настроек
server/api/      # Nitro: upload, blog-settings, post-views, …
utils/           # общие хелперы (Strapi base URL, раскладки, роли)
stores/          # Pinia (поиск, сессия пользователя)
public/img/      # статика лендинга
```

Фрагмент lifecycle-хука для Strapi лежит в `strapi-lifecycle-hook.js` (копируется в проект Strapi при необходимости).

## Роли и доступ

Маршруты `/settings*` и `/console*` защищены middleware: нужна роль администратора контента в Strapi Users & Permissions (см. `utils/strapiUserRole.js`, `middleware/settings-admin.ts`).

## Деплой

В `.github/workflows/ci-cd.yml` — сборка и выкладка на VPS через SCP + PM2 при пуше в `main`.  
Секреты: `HOST`, `USERNAME`, `PORT`, `SSH_PRIVATE_KEY`.

## Лицензия

Private / portfolio project.
