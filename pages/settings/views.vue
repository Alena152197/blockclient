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
                Ниже — график просмотров по дням, полный список ID посетителей из журнала и хронология открытий
                статей другими людьми (не ваши собственные просмотры). Один просмотр засчитывается один раз за
                сессию браузера на статью. Для гостей — ключ <span class="font-mono text-xs">anon:…</span>, для
                вошедших — <span class="font-mono text-xs">user:…</span>.
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
                <div class="mb-8 grid gap-4 sm:grid-cols-3">
                    <div class="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Уникальных посетителей</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">{{ uniqueVisitors }}</p>
                        <p class="mt-1 text-xs text-gray-500">по ключу браузера или аккаунта</p>
                    </div>
                    <div class="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Всего просмотров</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">{{ filteredEvents.length }}</p>
                        <p class="mt-1 text-xs text-gray-500">в выбранном списке статей</p>
                    </div>
                    <div class="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Статей в списке</p>
                        <p class="mt-1 text-2xl font-bold tabular-nums text-gray-900">{{ postRows.length }}</p>
                        <p class="mt-1 text-xs text-gray-500">{{ listScopeHint }}</p>
                    </div>
                </div>

                <h2 class="mb-2 text-lg font-semibold text-gray-900">График: просмотры статей по дням</h2>
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

                <h2 class="mb-2 text-lg font-semibold text-gray-900">Список ID посетителей</h2>
                <p class="mb-4 text-xs text-gray-500">
                    Уникальные ключи из журнала: <code class="rounded bg-gray-100 px-1">anon:&lt;uuid&gt;</code> для гостей,
                    <code class="rounded bg-gray-100 px-1">user:&lt;id&gt;</code> для вошедших в блог.
                </p>
                <div class="mb-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <p v-if="visitorRows.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока нет посетителей в выборке.
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">ID (как в логе)</th>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">Тип</th>
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
                                <td class="max-w-[14rem] px-4 py-3 font-mono text-xs text-gray-800 break-all sm:max-w-md">
                                    {{ row.key }}
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 text-gray-700">{{ row.kindLabel }}</td>
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

                <h2 class="mb-3 text-lg font-semibold text-gray-900">Журнал (новые сверху)</h2>
                <div class="mb-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <p v-if="filteredEvents.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока нет записей: когда гости откроют ваши статьи, здесь появятся дата и время.
                    </p>
                    <table v-else class="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                    Когда
                                </th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Действие</th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Статья</th>
                                <th scope="col" class="px-4 py-3 font-semibold text-gray-900">Кто</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr
                                v-for="(ev, idx) in filteredEvents"
                                :key="`${ev.at}-${ev.documentId}-${ev.visitorKey}-${idx}`"
                                class="hover:bg-gray-50/80"
                            >
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-gray-700">
                                    {{ formatWhen(ev.at) }}
                                </td>
                                <td class="px-4 py-3 text-gray-800">Открыл статью</td>
                                <td class="px-4 py-3">
                                    <NuxtLink
                                        :to="'/post/' + ev.documentId"
                                        class="font-medium text-blue-700 hover:underline"
                                    >
                                        {{ titleByDocId[ev.documentId] || 'Статья' }}
                                    </NuxtLink>
                                </td>
                                <td class="px-4 py-3 text-gray-700">{{ formatVisitor(ev.visitorKey) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 class="mb-3 text-lg font-semibold text-gray-900">Сводка по статьям</h2>
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

                <p v-if="postRows.length > 0" class="mt-4 text-center text-xs text-gray-500">
                    Всего просмотров по таблице: {{ totalViewsSum }}
                </p>
            </template>

            <p class="mt-8 text-center">
                <NuxtLink to="/" class="text-blue-600 hover:underline">На главную</NuxtLink>
            </p>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSearchStore } from '~/stores/search';
import { isContentAdminRole } from '~/utils/strapiUserRole';
import { STRAPI_BASE } from '~/utils/strapiBase'

const search = useSearchStore();
const base_url = STRAPI_BASE;

const loading = ref(true);
const loadError = ref('');
const viewsMap = ref({});
const posts = ref([]);
const events = ref([]);

definePageMeta({
    ssr: false
});

useHead({
    title: 'Активность посетителей — настройки'
});

function isMyPost(post) {
    if (isContentAdminRole(search.userMe)) return true;
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
    isContentAdminRole(search.userMe) ? posts.value : posts.value.filter(isMyPost)
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

const filteredEvents = computed(() => {
    const allow = allowedDocIds.value;
    return (events.value || [])
        .filter((e) => e && e.type === 'post_view' && allow.has(String(e.documentId)))
        .sort((a, b) => new Date(b.at) - new Date(a.at));
});

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
    isContentAdminRole(search.userMe) ? 'все статьи блога' : 'только ваши статьи'
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

function visitorKindLabel(key) {
    if (!key || typeof key !== 'string') return '—';
    if (key.startsWith('user:')) return 'Учётная запись';
    if (key.startsWith('anon:')) return 'Гость';
    return 'Другое';
}

const visitorRows = computed(() => {
    const m = new Map();
    for (const ev of filteredEvents.value) {
        const k = ev.visitorKey;
        if (!k) continue;
        if (!m.has(k)) {
            m.set(k, {
                key: k,
                kindLabel: visitorKindLabel(k),
                viewCount: 0,
                firstAt: ev.at,
                lastAt: ev.at
            });
        }
        const row = m.get(k);
        row.viewCount += 1;
        if (new Date(ev.at) < new Date(row.firstAt)) row.firstAt = ev.at;
        if (new Date(ev.at) > new Date(row.lastAt)) row.lastAt = ev.at;
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
    if (!key || typeof key !== 'string') return '—';
    if (key.startsWith('user:')) {
        return `Учётная запись №${key.slice(5)}`;
    }
    if (key.startsWith('anon:')) {
        const rest = key.slice(5);
        const short = rest.length > 10 ? `${rest.slice(0, 8)}…` : rest;
        return `Гость · ${short}`;
    }
    return key;
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
        const [viewsRes, activityRes, postsRes] = await Promise.all([
            $fetch('/api/post-views', { headers: auth }),
            $fetch('/api/blog-activity', { headers: auth }),
            $fetch(`${base_url}/api/posts?populate=*&sort=createdAt:desc`)
        ]);

        viewsMap.value = viewsRes?.views || {};
        events.value = Array.isArray(activityRes?.events) ? activityRes.events : [];
        posts.value = Array.isArray(postsRes?.data) ? postsRes.data : [];
    } catch (e) {
        loadError.value = e?.message || e?.data?.message || 'Не удалось загрузить данные.';
    } finally {
        loading.value = false;
    }
});
</script>
