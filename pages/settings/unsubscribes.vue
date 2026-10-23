<template>
    <main class="flex w-full flex-col items-center px-4 py-10 text-gray-900">
        <div class="w-full max-w-4xl">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 class="text-3xl font-bold">Отписки</h1>
                <NuxtLink
                    to="/settings"
                    :prefetch="false"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                    ← Настройки
                </NuxtLink>
            </div>

            <div
                v-if="!search.userMe?.id"
                class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
            >
                <NuxtLink to="/admin" class="font-semibold underline">Войдите</NuxtLink>, чтобы видеть отписки.
            </div>

            <div v-else-if="loadError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {{ loadError }}
            </div>

            <div v-else-if="loading" class="flex justify-center py-16">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
            </div>

            <template v-else>
                <p class="mb-4 text-xs text-gray-500">
                    Причины, которые указали пользователи при отписке. Всего:
                    <span class="font-semibold tabular-nums text-gray-800">{{ unsubscribes.length }}</span>
                </p>
                <div class="overflow-x-auto rounded-xl border border-rose-100 bg-white shadow-sm">
                    <p v-if="unsubscribes.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока никто не отписывался.
                    </p>
                    <ul v-else class="divide-y divide-gray-100">
                        <li
                            v-for="(u, idx) in unsubscribes"
                            :key="u.email + '-' + u.at + '-' + idx"
                            class="px-4 py-4 hover:bg-rose-50/40"
                        >
                            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                                <a
                                    :href="'mailto:' + u.email"
                                    class="break-all font-semibold text-blue-700 hover:underline"
                                >
                                    {{ u.email }}
                                </a>
                                <p class="text-xs tabular-nums text-gray-500">{{ formatWhen(u.at) }}</p>
                            </div>
                            <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{{ u.reason }}</p>
                        </li>
                    </ul>
                </div>
            </template>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSearchStore } from '~/stores/search'

const search = useSearchStore()
const loading = ref(true)
const loadError = ref('')
const unsubscribes = ref([])

definePageMeta({ ssr: false })
useHead({ title: 'Отписки — настройки' })

function formatWhen(iso) {
    try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return iso
    }
}

onMounted(async () => {
    loading.value = true
    loadError.value = ''
    try {
        if (!search.userMe?.id) {
            await search.fetchUserMe()
        }
        if (!search.userMe?.id) {
            loading.value = false
            return
        }
        const token = localStorage.getItem('jwt')
        const res = await $fetch('/api/unsubscribes', {
            headers: { Authorization: `Bearer ${token}` }
        })
        unsubscribes.value = Array.isArray(res?.unsubscribes) ? res.unsubscribes : []
    } catch (e) {
        loadError.value = e?.message || e?.data?.message || 'Не удалось загрузить отписки.'
    } finally {
        loading.value = false
    }
})
</script>
