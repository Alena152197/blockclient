<template>
    <main class="flex w-full flex-col items-center px-4 py-10 text-gray-900">
        <div class="w-full max-w-4xl">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 class="text-3xl font-bold">Активность посетителей</h1>
                <NuxtLink
                    to="/settings"
                    :prefetch="false"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                    ← Настройки
                </NuxtLink>
            </div>

            <p class="mb-6 text-sm text-gray-600">
                Ниже — график просмотров по дням, список посетителей и журнал открытий статей.
                Один просмотр засчитывается один раз за сессию на статью.
                Типы: <span class="font-medium text-gray-800">Подписан</span> — вошёл и есть в рассылке,
                <span class="font-medium text-gray-800">Гость</span> — вошёл на сайт, но не подписан,
                <span class="font-medium text-gray-800">Аноним</span> — смотрел без входа.
            </p>

            <div
                v-if="!search.userMe?.id"
                class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
            >
                <NuxtLink to="/admin" class="font-semibold underline">Войдите</NuxtLink>, чтобы видеть журнал.
            </div>

            <div v-else-if="loadError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {{ loadError }}
            </div>

            <div v-else-if="loading" class="flex justify-center py-16">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>

            <template v-else>
                <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                        @click="scrollToSection('visitors')"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Уникальных посетителей</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">{{ uniqueVisitors }}</p>
                        <p class="mt-1 text-xs text-gray-500">к списку ↓</p>
                    </button>
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                        @click="scrollToSection('views-chart')"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Всего просмотров</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">{{ filteredEvents.length }}</p>
                        <p class="mt-1 text-xs text-gray-500">к графику ↓</p>
                    </button>
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                        @click="scrollToSection('posts')"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Статей в списке</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">{{ postRows.length }}</p>
                        <p class="mt-1 text-xs text-gray-500">{{ listScopeHint }} ↓</p>
                    </button>
                    <button
                        type="button"
                        class="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-4 text-left shadow-sm transition hover:bg-sky-50"
                        @click="scrollToSection('comments')"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-sky-800/80">Комментариев</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-sky-950">{{ commentsCount }}</p>
                        <p class="mt-1 text-xs text-sky-900/70">к списку ↓</p>
                    </button>
                    <button
                        type="button"
                        class="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-4 text-left shadow-sm transition hover:bg-emerald-50"
                        @click="scrollToSection('subscribers')"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-emerald-800/80">Подписчиков</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-emerald-950">{{ subscribersCount }}</p>
                        <p class="mt-1 text-xs text-emerald-900/70">к списку ↓</p>
                    </button>
                    <button
                        type="button"
                        class="rounded-xl border border-stone-300 bg-stone-50/80 px-4 py-4 text-left shadow-sm transition hover:bg-stone-100"
                        @click="scrollToSection('blocked')"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-stone-700/80">Заблокированных</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-stone-950">{{ blockedCount }}</p>
                        <p class="mt-1 text-xs text-stone-800/70">к списку ↓</p>
                    </button>
                </div>

                <button
                    id="subscribers"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('subscribers')"
                    @click="toggleSection('subscribers')"
                >
                    <span>Подписчики</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('subscribers') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('subscribers')">
                <p class="mb-4 text-xs text-gray-500">
                    Email с страницы «Подписаться». Всего:
                    <span class="font-semibold tabular-nums text-gray-800">{{ subscribersCount }}</span>
                </p>
                <div class="mb-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <p v-if="activeSubscribers.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        {{ subscribers.length ? 'Активных подписчиков нет (есть в «Заблокированных»).' : 'Пока никто не подписался.' }}
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Email</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                    Дата подписки
                                </th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                                    Действие
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="s in activeSubscribers" :key="s.email" class="hover:bg-gray-50/80">
                                <td class="px-4 py-3">
                                    <a
                                        :href="'mailto:' + s.email"
                                        class="font-medium text-blue-700 hover:underline break-all"
                                    >
                                        {{ s.email }}
                                    </a>
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">
                                    {{ formatWhen(s.at) }}
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        class="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-800 hover:bg-stone-50 disabled:opacity-50"
                                        :disabled="blockBusyEmail === s.email"
                                        @click="blockSubscriber(s)"
                                    >
                                        {{ blockBusyEmail === s.email ? '…' : 'Заблокировать' }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>

                <button
                    id="blocked"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('blocked')"
                    @click="toggleSection('blocked')"
                >
                    <span>Заблокированные</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('blocked') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('blocked')">
                <p class="mb-4 text-xs text-gray-500">
                    Этим пользователям закрыт вход и API сайта. Всего:
                    <span class="font-semibold tabular-nums text-gray-800">{{ blockedCount }}</span>
                </p>
                <div class="mb-10 overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
                    <p v-if="blockedUsers.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Никого не блокировали.
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Email</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                    Когда
                                </th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Причина</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                                    Действие
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="b in blockedUsers" :key="b.email" class="hover:bg-stone-50/60">
                                <td class="px-4 py-3">
                                    <a
                                        :href="'mailto:' + b.email"
                                        class="font-medium text-blue-700 hover:underline break-all"
                                    >
                                        {{ b.email }}
                                    </a>
                                    <p v-if="b.userId != null" class="mt-0.5 font-mono text-xs text-gray-500">
                                        user:{{ b.userId }}
                                    </p>
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">
                                    {{ formatWhen(b.at) }}
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-700">
                                    {{ b.reason || '—' }}
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        class="rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
                                        :disabled="blockBusyEmail === b.email"
                                        @click="unblockUser(b)"
                                    >
                                        {{ blockBusyEmail === b.email ? '…' : 'Разблокировать' }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>

                <button
                    id="comments"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('comments')"
                    @click="toggleSection('comments')"
                >
                    <span>Комментарии</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('comments') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('comments')">
                <p class="mb-4 text-xs text-gray-500">
                    Комментарии к статьям из выборки. Всего:
                    <span class="font-semibold tabular-nums text-gray-800">{{ commentsCount }}</span>
                </p>
                <div class="mb-10 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
                    <p v-if="commentRows.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока комментариев нет.
                    </p>
                    <div v-else class="max-h-[40rem] overflow-y-auto overscroll-contain">
                        <ul class="divide-y divide-gray-100">
                            <li
                                v-for="c in commentRows"
                                :key="c.id"
                                class="px-4 py-4 hover:bg-sky-50/40"
                            >
                                <div class="mb-1 flex flex-wrap items-start justify-between gap-2">
                                    <div class="min-w-0">
                                        <p class="font-semibold text-gray-900">{{ c.authorName }}</p>
                                        <p class="text-xs tabular-nums text-gray-500">{{ formatWhen(c.at) }}</p>
                                    </div>
                                    <button
                                        v-if="isAdmin"
                                        type="button"
                                        class="shrink-0 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                        :disabled="commentDeletingId === c.id"
                                        title="Удалить комментарий"
                                        @click="deleteAdminComment(c)"
                                    >
                                        {{ commentDeletingId === c.id ? '…' : 'Удалить' }}
                                    </button>
                                </div>
                                <p class="mb-2 text-xs text-gray-500">
                                    К статье:
                                    <NuxtLink
                                        v-if="c.postDocumentId"
                                        :to="'/post/' + c.postDocumentId"
                                        class="font-medium text-blue-700 hover:underline"
                                    >
                                        {{ c.postTitle }}
                                    </NuxtLink>
                                    <span v-else>{{ c.postTitle }}</span>
                                </p>
                                <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{{ c.text }}</p>
                            </li>
                        </ul>
                    </div>
                    <p
                        v-if="commentRows.length > 10"
                        class="border-t border-sky-50 px-4 py-2 text-center text-xs text-gray-500"
                    >
                        Показаны все {{ commentsCount }} — прокрутите список (на экране ~10)
                    </p>
                </div>
                </div>

                <button
                    id="views-chart"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('views-chart')"
                    @click="toggleSection('views-chart')"
                >
                    <span>График: просмотры статей по дням</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('views-chart') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('views-chart')">
                <p class="mb-4 text-xs text-gray-500">
                    По событиям «открылась статья» за последние {{ chartDayCount }} дней (ваши статьи или весь блог — как в таблицах ниже).
                </p>
                <div class="mb-10 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p v-if="dailyChart.periodTotal === 0" class="py-8 text-center text-sm text-gray-500">
                        Нет данных за этот период.
                    </p>
                    <div v-else class="flex flex-col gap-3">
                        <div
                            class="flex h-48 justify-between gap-1 sm:gap-2"
                            role="img"
                            :aria-label="`Столбцы: просмотры по дням, максимум ${dailyChart.maxCount}`"
                        >
                            <div
                                v-for="b in dailyChart.buckets"
                                :key="b.key"
                                class="flex min-h-0 min-w-0 flex-1 flex-col"
                            >
                                <div class="flex min-h-0 flex-1 flex-col justify-end pb-1">
                                    <span
                                        class="block w-full max-w-[2.5rem] rounded-t bg-emerald-500/90 transition-[height] duration-300 sm:max-w-none"
                                        :style="{
                                            height: `${dailyChart.barHeightPercent(b.count)}%`,
                                            minHeight: b.count > 0 ? '3px' : '0'
                                        }"
                                        :title="`${b.label}: ${b.count}`"
                                    />
                                </div>
                                <span
                                    class="max-w-full truncate text-center text-[10px] font-medium leading-tight text-gray-500 sm:text-xs"
                                >
                                    {{ b.shortLabel }}
                                </span>
                            </div>
                        </div>
                        <p class="text-center text-xs text-gray-500">
                            Всего за период: <span class="font-semibold tabular-nums text-gray-800">{{ dailyChart.periodTotal }}</span>
                            · пик: <span class="font-semibold tabular-nums text-gray-800">{{ dailyChart.maxCount }}</span> в день
                        </p>
                    </div>
                </div>
                </div>

                <button
                    id="visitors"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('visitors')"
                    @click="toggleSection('visitors')"
                >
                    <span>Список ID посетителей</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('visitors') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('visitors')">
                <p class="mb-4 text-xs text-gray-500">
                    Подписан — вошёл и подписан на рассылку; Гость — вошёл без подписки; Аноним — без входа.
                    Просмотр статьи считается один раз за сессию на статью (на аккаунт).
                </p>
                <div class="mb-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <p v-if="visitorRows.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока нет посетителей в выборке.
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Кто</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">Тип</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">Страна</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                                    Просмотров
                                </th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                    Первый раз
                                </th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                    Последний раз
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="row in visitorRows" :key="row.key" class="hover:bg-gray-50/80">
                                <td class="max-w-[16rem] px-4 py-3 text-sm text-gray-800 sm:max-w-md">
                                    <p v-if="row.email" class="font-medium break-all">{{ row.email }}</p>
                                    <p class="font-mono text-xs text-gray-500 break-all">{{ row.key }}</p>
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 text-gray-700">{{ row.kindLabel }}</td>
                                <td class="whitespace-nowrap px-4 py-3 text-gray-700">{{ row.country || '—' }}</td>
                                <td class="whitespace-nowrap px-4 py-3 text-right tabular-nums text-gray-800">
                                    {{ row.viewCount }}
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">
                                    {{ formatWhen(row.firstAt) }}
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">
                                    {{ formatWhen(row.lastAt) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>

                <button
                    id="journal"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('journal')"
                    @click="toggleSection('journal')"
                >
                    <span>Журнал (новые сверху)</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('journal') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('journal')">
                <div class="mb-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <p v-if="journalEvents.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока нет записей: просмотры статей и подписки появятся здесь.
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                    Когда
                                </th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Действие</th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Детали</th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Кто</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">Страна</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr
                                v-for="(ev, idx) in journalEvents"
                                :key="`${ev.at}-${ev.type}-${ev.documentId || ev.email}-${ev.visitorKey}-${idx}`"
                                class="hover:bg-gray-50/80"
                            >
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-gray-700">
                                    {{ formatWhen(ev.at) }}
                                </td>
                                <td class="px-4 py-3 text-gray-800">{{ journalActionLabel(ev) }}</td>
                                <td class="px-4 py-3">
                                    <NuxtLink
                                        v-if="ev.type === 'post_view' && ev.documentId"
                                        :to="'/post/' + ev.documentId"
                                        class="font-medium text-blue-700 hover:underline"
                                    >
                                        {{ titleByDocId[ev.documentId] || 'Статья' }}
                                    </NuxtLink>
                                    <template v-if="ev.type === 'subscribe' || ev.type === 'unsubscribe'">
                                        <span v-if="ev.email" class="break-all text-gray-800">{{ ev.email }}</span>
                                        <span v-else class="text-gray-400">—</span>
                                        <p
                                            v-if="ev.type === 'unsubscribe' && ev.detail"
                                            class="mt-1 text-xs text-gray-500"
                                        >
                                            Причина: {{ ev.detail }}
                                        </p>
                                    </template>
                                    <span v-else class="text-gray-400">—</span>
                                </td>
                                <td class="px-4 py-3 text-gray-700">{{ formatVisitor(ev.visitorKey) }}</td>
                                <td class="whitespace-nowrap px-4 py-3 text-gray-700">{{ ev.country || '—' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>

                <button
                    id="posts"
                    type="button"
                    class="mb-2 flex w-full scroll-mt-24 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-lg font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                    :aria-expanded="isSectionOpen('posts')"
                    @click="toggleSection('posts')"
                >
                    <span>Сводка по статьям</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': isSectionOpen('posts') }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div v-show="isSectionOpen('posts')">
                <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <p v-if="postRows.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Нет статей для отображения.
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Статья</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                                    Просмотры
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="row in postRows" :key="row.documentId" class="hover:bg-gray-50/80">
                                <td class="px-4 py-3">
                                    <NuxtLink
                                        :to="'/post/' + row.documentId"
                                        class="font-medium text-blue-700 hover:underline"
                                    >
                                        {{ row.title }}
                                    </NuxtLink>
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 text-right tabular-nums text-gray-800">
                                    {{ row.views }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="postRows.length > 0" class="mt-4 mb-10 text-center text-xs text-gray-500">
                    Всего просмотров по таблице: {{ totalViewsSum }}
                </p>
                </div>
            </template>

            <p class="mt-8 text-center">
                <NuxtLink to="/" class="text-blue-600 hover:underline">На главную</NuxtLink>
            </p>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useSearchStore } from '~/stores/search';
import { isContentAdminRole } from '~/utils/strapiUserRole';
import { STRAPI_BASE } from '~/utils/strapiBase'

const search = useSearchStore();
const base_url = STRAPI_BASE;
const runtimeConfig = useRuntimeConfig();
const adminAllow = computed(() => ({
    emails: runtimeConfig.public.contentAdminEmails || '',
    usernames: runtimeConfig.public.contentAdminUsernames || ''
}));
const isAdmin = computed(() => isContentAdminRole(search.userMe, adminAllow.value));

const loading = ref(true);
const loadError = ref('');
const viewsMap = ref({});
const posts = ref([]);
const events = ref([]);
const subscribers = ref([]);
const blockedUsers = ref([]);
const blockedCount = computed(() => blockedUsers.value.length);
const blockedEmailSet = computed(() => {
    const s = new Set();
    for (const b of blockedUsers.value || []) {
        if (b?.email) s.add(String(b.email).toLowerCase());
    }
    return s;
});
const activeSubscribers = computed(() =>
    (subscribers.value || []).filter((x) => !blockedEmailSet.value.has(String(x.email || '').toLowerCase()))
);
const subscribersCount = computed(() => activeSubscribers.value.length);
const allComments = ref([]);
const blockBusyEmail = ref('');

const openSections = ref({
    subscribers: false,
    blocked: false,
    comments: false,
    'views-chart': false,
    visitors: false,
    journal: false,
    posts: false
});

function isSectionOpen(id) {
    return Boolean(openSections.value[id]);
}

function toggleSection(id) {
    openSections.value = {
        ...openSections.value,
        [id]: !openSections.value[id]
    };
}

async function scrollToSection(id) {
    if (!import.meta.client || !id) return;
    openSections.value = { ...openSections.value, [id]: true };
    await nextTick();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
        history.replaceState(null, '', `#${id}`);
    } catch {
        /* ignore */
    }
}

function commentTextOf(c) {
    return (
        c?.Content ||
        c?.content ||
        c?.text ||
        c?.message ||
        c?.body ||
        c?.commentText ||
        c?.description ||
        ''
    );
}

function commentAuthorName(c) {
    const a = c?.author;
    if (typeof a === 'string') return a;
    if (a && typeof a === 'object') {
        return a.username || a.email || 'Гость';
    }
    return 'Гость';
}

function commentPostMeta(c) {
    let postRef = c?.post ?? c?.article ?? c?.blog_post;
    if (postRef?.data !== undefined) {
        postRef = Array.isArray(postRef.data) ? postRef.data[0] : postRef.data;
    }
    if (postRef?.attributes) {
        postRef = { id: postRef.id, documentId: postRef.documentId, ...postRef.attributes };
    }

    let rawId =
        (postRef && typeof postRef === 'object' && (postRef.documentId || postRef.id)) ||
        (typeof postRef === 'string' || typeof postRef === 'number' ? postRef : null) ||
        c?.postId ||
        c?.post_id ||
        null;

    let documentId = rawId != null ? String(rawId) : '';
    let title =
        (postRef && typeof postRef === 'object' && postRef.title) ||
        titleByDocId.value[documentId] ||
        '';

    if (documentId || rawId != null) {
        const match = (posts.value || []).find(
            (p) =>
                String(p.documentId) === documentId ||
                String(p.id) === documentId ||
                String(p.id) === String(rawId)
        );
        if (match) {
            documentId = String(match.documentId || match.id);
            title = match.title?.trim() || title;
        }
    }

    if (!title) title = documentId ? titleByDocId.value[documentId] || 'Статья' : 'Статья';
    return { documentId, title: String(title) };
}

const commentRows = computed(() => {
    const allow = allowedDocIds.value;
    const admin = isAdmin.value;
    const rows = [];
    for (const raw of allComments.value || []) {
        // Strapi 4/5: иногда data/attributes
        let c = raw;
        if (c?.attributes && typeof c.attributes === 'object') {
            c = { id: c.id, documentId: c.documentId, ...c.attributes };
        }
        const meta = commentPostMeta(c);
        // Админ видит все; остальные — только к своим статьям (без post всё равно показываем админу)
        if (!admin) {
            if (meta.documentId && !allow.has(meta.documentId)) continue;
        }
        rows.push({
            id: c.documentId || c.id,
            rawId: c.id,
            documentId: c.documentId,
            text: String(commentTextOf(c) || '—').trim() || '—',
            authorName: commentAuthorName(c),
            at: c.createdAt || c.updatedAt || '',
            postDocumentId: meta.documentId,
            postTitle: meta.title
        });
    }
    return rows.sort((a, b) => new Date(b.at) - new Date(a.at));
});

const commentsCount = computed(() => commentRows.value.length);
const commentDeletingId = ref(null);

async function deleteAdminComment(c) {
    if (!c?.id || !isAdmin.value) return;
    if (!confirm('Удалить этот комментарий?')) return;
    commentDeletingId.value = c.id;
    try {
        const token = localStorage.getItem('jwt');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const idToDelete = c.documentId || c.id;
        await $fetch(`/api/admin/comments/${encodeURIComponent(idToDelete)}`, {
            method: 'DELETE',
            headers
        });
        allComments.value = (allComments.value || []).filter(
            (x) =>
                x.id !== c.rawId &&
                x.id !== c.id &&
                x.documentId !== c.id &&
                x.documentId !== c.documentId
        );
    } catch (e) {
        alert(e?.data?.message || e?.message || 'Не удалось удалить комментарий');
    } finally {
        commentDeletingId.value = null;
    }
}

function editorAuthHeaders() {
    const token = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${token}` };
    const email = search.userMe?.email;
    const username = search.userMe?.username;
    if (email) headers['x-editor-email'] = encodeURIComponent(email);
    if (username) headers['x-editor-username'] = encodeURIComponent(username);
    return headers;
}

async function blockSubscriber(s) {
    if (!s?.email || !isAdmin.value) return;
    const reason = window.prompt('Причина блокировки (необязательно):', '') ?? null;
    if (reason === null) return;
    if (!confirm(`Заблокировать ${s.email}? Пользователь потеряет доступ к сайту.`)) return;
    blockBusyEmail.value = s.email;
    try {
        const res = await $fetch('/api/blocked', {
            method: 'POST',
            headers: {
                ...editorAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: {
                email: s.email,
                userId: s.userId ?? null,
                reason: String(reason || '').trim(),
                editorEmail: search.userMe?.email || '',
                editorUsername: search.userMe?.username || ''
            }
        });
        if (res?.blocked) {
            blockedUsers.value = [
                res.blocked,
                ...(blockedUsers.value || []).filter(
                    (b) => String(b.email).toLowerCase() !== String(s.email).toLowerCase()
                )
            ];
        }
        openSections.value = { ...openSections.value, blocked: true };
    } catch (e) {
        alert(e?.data?.message || e?.message || 'Не удалось заблокировать');
    } finally {
        blockBusyEmail.value = '';
    }
}

async function unblockUser(b) {
    if (!b?.email || !isAdmin.value) return;
    if (!confirm(`Разблокировать ${b.email}?`)) return;
    blockBusyEmail.value = b.email;
    try {
        await $fetch('/api/blocked/unblock', {
            method: 'POST',
            headers: {
                ...editorAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: {
                email: b.email,
                editorEmail: search.userMe?.email || '',
                editorUsername: search.userMe?.username || ''
            }
        });
        blockedUsers.value = (blockedUsers.value || []).filter(
            (x) => String(x.email).toLowerCase() !== String(b.email).toLowerCase()
        );
    } catch (e) {
        alert(e?.data?.message || e?.message || 'Не удалось разблокировать');
    } finally {
        blockBusyEmail.value = '';
    }
}

definePageMeta({
    ssr: false
});

useHead({
    title: 'Активность посетителей — настройки'
});

function isMyPost(post) {
    if (isAdmin.value) return true;
    const postAuthorId = post.author?.id || post.author?.data?.id || post.author;
    const postAuthorDocumentId = post.author?.documentId;
    return (
        postAuthorId === search.userMe?.id ||
        postAuthorDocumentId === search.userMe?.id ||
        String(postAuthorId) === String(search.userMe?.id) ||
        (post.author && typeof post.author === 'object' && post.author.id === search.userMe?.id)
    );
}

const scopedPosts = computed(() =>
    isAdmin.value ? posts.value : posts.value.filter(isMyPost)
);

const allowedDocIds = computed(() => {
    const s = new Set();
    for (const p of scopedPosts.value) {
        s.add(String(p.documentId || p.id));
    }
    return s;
});

const titleByDocId = computed(() => {
    const m = {};
    for (const p of posts.value) {
        m[String(p.documentId || p.id)] = p.title?.trim() || 'Без названия';
    }
    return m;
});

/** Только просмотры статей — для графика и списка посетителей */
const filteredEvents = computed(() => {
    const allow = allowedDocIds.value;
    return (events.value || [])
        .filter((e) => e && e.type === 'post_view' && allow.has(String(e.documentId)))
        .sort((a, b) => new Date(b.at) - new Date(a.at));
});

/** Журнал: просмотры + подписки + отписки */
const journalEvents = computed(() => {
    const allow = allowedDocIds.value;
    return (events.value || [])
        .filter((e) => {
            if (!e || !e.type) return false;
            if (e.type === 'post_view') return allow.has(String(e.documentId));
            if (e.type === 'subscribe' || e.type === 'unsubscribe') return true;
            return false;
        })
        .sort((a, b) => new Date(b.at) - new Date(a.at));
});

function journalActionLabel(ev) {
    if (ev?.type === 'subscribe') return 'Подписался';
    if (ev?.type === 'unsubscribe') return 'Отписался';
    return 'Открыл статью';
}

const uniqueVisitors = computed(() => new Set(filteredEvents.value.map((e) => e.visitorKey)).size);

const postRows = computed(() => {
    const vm = viewsMap.value || {};
    return scopedPosts.value
        .map((p) => {
            const documentId = String(p.documentId || p.id);
            const views = vm[documentId] ?? 0;
            return {
                documentId,
                title: p.title?.trim() || 'Без названия',
                views
            };
        })
        .sort((a, b) => b.views - a.views || a.title.localeCompare(b.title, 'ru'));
});

const totalViewsSum = computed(() => postRows.value.reduce((s, r) => s + r.views, 0));

const listScopeHint = computed(() =>
    isAdmin.value ? 'все статьи блога' : 'только ваши статьи'
);

/** Длина графика в днях (шаблон и подпись). */
const chartDayCount = 14;

function localDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function eventLocalDayKey(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return localDateKey(d);
}

const dailyChart = computed(() => {
    const events = filteredEvents.value;
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - (chartDayCount - 1));
    start.setHours(0, 0, 0, 0);

    const buckets = [];
    for (let i = 0; i < chartDayCount; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = localDateKey(d);
        buckets.push({
            key,
            shortLabel: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
            label: d.toLocaleDateString('ru-RU', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }),
            count: 0
        });
    }
    const idxByKey = new Map(buckets.map((b, i) => [b.key, i]));
    for (const ev of events) {
        const day = eventLocalDayKey(ev.at);
        const idx = idxByKey.get(day);
        if (idx !== undefined) buckets[idx].count += 1;
    }
    const periodTotal = buckets.reduce((s, b) => s + b.count, 0);
    const maxCount = periodTotal === 0 ? 0 : Math.max(...buckets.map((b) => b.count));
    return {
        buckets,
        periodTotal,
        maxCount,
        barHeightPercent(c) {
            if (!maxCount) return 0;
            return (c / maxCount) * 100;
        }
    };
});

function emailForVisitorKey(key) {
    if (!key || typeof key !== 'string') return '';
    if (key.startsWith('email:')) return key.slice(6);
    if (key.startsWith('user:')) {
        const uid = key.slice(5);
        const fromSub = (subscribers.value || []).find(
            (s) => s.userId != null && String(s.userId) === String(uid)
        );
        if (fromSub?.email) return fromSub.email;
        const fromEv = (events.value || []).find(
            (e) => e.visitorKey === key && e.email
        );
        if (fromEv?.email) return fromEv.email;
    }
    return '';
}

/** Подписан / Гость / Аноним */
function visitorKindLabel(key) {
    if (!key || typeof key !== 'string') return '—';
    if (key.startsWith('anon:')) return 'Аноним';
    if (key.startsWith('email:')) {
        const email = key.slice(6).toLowerCase();
        const subscribed = (subscribers.value || []).some(
            (s) => String(s.email || '').toLowerCase() === email
        );
        return subscribed ? 'Подписан' : 'Гость';
    }
    if (key.startsWith('user:')) {
        const uid = key.slice(5);
        const subscribed = (subscribers.value || []).some(
            (s) => s.userId != null && String(s.userId) === String(uid)
        );
        return subscribed ? 'Подписан' : 'Гость';
    }
    return '—';
}

const visitorRows = computed(() => {
    const m = new Map();
    // Страну и email также берём из подписок/отписок
    const allForMeta = (events.value || []).filter(
        (e) => e && (e.type === 'post_view' || e.type === 'subscribe' || e.type === 'unsubscribe')
    );
    for (const ev of filteredEvents.value) {
        const k = ev.visitorKey;
        if (!k) continue;
        if (!m.has(k)) {
            m.set(k, {
                key: k,
                email: emailForVisitorKey(k),
                kindLabel: visitorKindLabel(k),
                country: '',
                viewCount: 0,
                firstAt: ev.at,
                lastAt: ev.at
            });
        }
        const row = m.get(k);
        row.viewCount += 1;
        row.kindLabel = visitorKindLabel(k);
        if (!row.email) row.email = emailForVisitorKey(k) || ev.email || '';
        if (ev.country && String(ev.country).trim()) {
            if (!row.country || new Date(ev.at) >= new Date(row.lastAt)) {
                row.country = String(ev.country).trim();
            }
        }
        if (new Date(ev.at) < new Date(row.firstAt)) row.firstAt = ev.at;
        if (new Date(ev.at) > new Date(row.lastAt)) row.lastAt = ev.at;
    }
    for (const ev of allForMeta) {
        const k = ev.visitorKey;
        if (!k || !m.has(k)) continue;
        const row = m.get(k);
        if (ev.email && !row.email) row.email = ev.email;
        if (ev.country && String(ev.country).trim()) {
            if (!row.country || new Date(ev.at) >= new Date(row.lastAt)) {
                row.country = String(ev.country).trim();
            }
        }
    }
    return [...m.values()].sort(
        (a, b) =>
            new Date(b.lastAt) - new Date(a.lastAt) || b.viewCount - a.viewCount || a.key.localeCompare(b.key)
    );
});

function formatWhen(iso) {
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return iso;
    }
}

function formatVisitor(key) {
    return visitorKindLabel(key);
}

function normalizePostRow(raw) {
    if (!raw || typeof raw !== 'object') return raw;
    if (raw.attributes && typeof raw.attributes === 'object') {
        return { id: raw.id, documentId: raw.documentId, ...raw.attributes };
    }
    return raw;
}

onMounted(async () => {
    loading.value = true;
    loadError.value = '';
    try {
        if (!search.userMe?.id) {
            await search.fetchUserMe();
        }
        if (!search.userMe?.id) {
            loading.value = false;
            return;
        }

        const token = localStorage.getItem('jwt');
        const auth = { Authorization: `Bearer ${token}` };

        // Сначала ядро (график / журнал / статьи) — страница не ждёт подписчиков и комментарии.
        // У Post в Strapi нет relation author — только title и т.п.
        const postsUrl =
            `${base_url}/api/posts` +
            `?fields[0]=title&fields[1]=createdAt` +
            `&sort=createdAt:desc&pagination[pageSize]=100`;

        const [viewsRes, activityRes, postsRes] = await Promise.all([
            $fetch('/api/post-views', { headers: auth }),
            $fetch('/api/blog-activity', { headers: auth }),
            $fetch(postsUrl)
        ]);

        viewsMap.value = viewsRes?.views || {};
        events.value = Array.isArray(activityRes?.events) ? activityRes.events : [];
        posts.value = (Array.isArray(postsRes?.data) ? postsRes.data : []).map(normalizePostRow);
        loading.value = false;

        if (import.meta.client) {
            const hash = window.location.hash?.replace(/^#/, '');
            if (hash) {
                await nextTick();
                scrollToSection(hash);
            }
        }

        const [subsRes, commentsRes, blockedRes] = await Promise.all([
            $fetch('/api/subscribers', { headers: auth }).catch(() => ({ subscribers: [] })),
            $fetch('/api/admin/comments', { headers: auth }).catch((e) => {
                console.warn('Не удалось загрузить комментарии:', e?.data?.message || e?.message || e);
                return { data: [] };
            }),
            $fetch('/api/blocked', { headers: editorAuthHeaders() }).catch(() => ({ blocked: [] }))
        ]);

        subscribers.value = Array.isArray(subsRes?.subscribers) ? subsRes.subscribers : [];
        allComments.value = Array.isArray(commentsRes?.data) ? commentsRes.data : [];
        blockedUsers.value = Array.isArray(blockedRes?.blocked) ? blockedRes.blocked : [];
    } catch (e) {
        loadError.value = e?.message || e?.data?.message || 'Не удалось загрузить данные.';
        loading.value = false;
    }
});
</script>
