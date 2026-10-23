<template>
    <main class="flex w-full flex-col items-center px-4 py-10 text-gray-900">
        <div class="w-full max-w-4xl">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 class="text-3xl font-bold">Обращения и предложения</h1>
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
                <NuxtLink to="/admin" class="font-semibold underline">Войдите</NuxtLink>, чтобы видеть обращения.
            </div>

            <div v-else-if="loadError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {{ loadError }}
            </div>

            <div v-else-if="loading" class="flex justify-center py-16">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            </div>

            <template v-else>
                <p class="mb-4 text-xs text-gray-500">
                    Сообщения со страницы «Предложения по улучшению». Всего:
                    <span class="font-semibold tabular-nums text-gray-800">{{ suggestions.length }}</span>
                </p>
                <div class="overflow-x-auto rounded-xl border border-violet-100 bg-white shadow-sm">
                    <p v-if="suggestions.length === 0" class="px-4 py-8 text-center text-sm text-gray-500">
                        Пока обращений нет.
                    </p>
                    <ul v-else class="divide-y divide-gray-100">
                        <li
                            v-for="s in suggestions"
                            :key="s.id"
                            class="px-4 py-4 hover:bg-violet-50/40"
                        >
                            <div class="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                                <p class="font-semibold text-gray-900">{{ s.name || 'Без имени' }}</p>
                                <p class="text-xs tabular-nums text-gray-500">{{ formatWhen(s.at) }}</p>
                            </div>
                            <p v-if="s.email" class="mb-2 text-sm">
                                <a :href="'mailto:' + s.email" class="break-all text-blue-700 hover:underline">{{
                                    s.email
                                }}</a>
                            </p>
                            <p class="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{{ s.text }}</p>

                            <div
                                v-if="s.reply"
                                class="mb-3 rounded-lg border border-violet-200 bg-violet-50/80 px-3 py-2.5"
                            >
                                <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-800">
                                    Ваш ответ
                                    <span v-if="s.repliedAt" class="font-normal normal-case text-gray-500">
                                        · {{ formatWhen(s.repliedAt) }}
                                    </span>
                                </p>
                                <p class="whitespace-pre-wrap text-sm text-gray-900">{{ s.reply }}</p>
                            </div>

                            <div class="space-y-2">
                                <label :for="'reply-' + s.id" class="block text-xs font-medium text-gray-600">
                                    {{ s.reply ? 'Изменить ответ' : 'Ответить пользователю' }}
                                </label>
                                <textarea
                                    :id="'reply-' + s.id"
                                    v-model="replyDrafts[s.id]"
                                    rows="3"
                                    maxlength="4000"
                                    placeholder="Текст ответа…"
                                    class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                                />
                                <div class="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        class="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                                        :disabled="replySavingId === s.id || !(replyDrafts[s.id] || '').trim()"
                                        @click="sendReply(s.id)"
                                    >
                                        {{
                                            replySavingId === s.id
                                                ? 'Сохраняю…'
                                                : s.reply
                                                  ? 'Обновить ответ'
                                                  : 'Отправить ответ'
                                        }}
                                    </button>
                                    <span
                                        v-if="replyStatus[s.id]"
                                        class="text-xs"
                                        :class="replyStatus[s.id].ok ? 'text-green-700' : 'text-red-700'"
                                    >
                                        {{ replyStatus[s.id].text }}
                                    </span>
                                </div>
                            </div>
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
const suggestions = ref([])
const replyDrafts = ref({})
const replySavingId = ref(null)
const replyStatus = ref({})

definePageMeta({ ssr: false })
useHead({ title: 'Обращения — настройки' })

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

function editorAuthHeaders() {
    const token = localStorage.getItem('jwt')
    const headers = { Authorization: `Bearer ${token}` }
    const email = search.userMe?.email
    const username = search.userMe?.username
    if (email) headers['x-editor-email'] = encodeURIComponent(email)
    if (username) headers['x-editor-username'] = encodeURIComponent(username)
    return headers
}

async function sendReply(id) {
    const reply = String(replyDrafts.value[id] || '').trim()
    if (!reply) return
    replySavingId.value = id
    replyStatus.value = { ...replyStatus.value, [id]: null }
    try {
        const res = await $fetch(`/api/suggestions/${encodeURIComponent(id)}/reply`, {
            method: 'POST',
            headers: {
                ...editorAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: {
                reply,
                editorEmail: search.userMe?.email || '',
                editorUsername: search.userMe?.username || ''
            }
        })
        const updated = res?.suggestion
        if (updated) {
            suggestions.value = suggestions.value.map((s) => (s.id === id ? { ...s, ...updated } : s))
            replyDrafts.value = { ...replyDrafts.value, [id]: updated.reply || reply }
        }
        replyStatus.value = {
            ...replyStatus.value,
            [id]: {
                ok: true,
                text: 'Ответ сохранён — пользователь увидит его на странице предложений.'
            }
        }
    } catch (e) {
        replyStatus.value = {
            ...replyStatus.value,
            [id]: {
                ok: false,
                text: e?.data?.message || e?.message || 'Не удалось сохранить ответ'
            }
        }
    } finally {
        replySavingId.value = null
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
        const res = await $fetch('/api/suggestions', {
            headers: { Authorization: `Bearer ${token}` }
        })
        suggestions.value = Array.isArray(res?.suggestions) ? res.suggestions : []
        const drafts = {}
        for (const s of suggestions.value) {
            drafts[s.id] = s.reply || ''
        }
        replyDrafts.value = drafts
    } catch (e) {
        loadError.value = e?.message || e?.data?.message || 'Не удалось загрузить обращения.'
    } finally {
        loading.value = false
    }
})
</script>
