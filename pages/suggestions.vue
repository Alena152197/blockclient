<template>
    <main class="mx-auto w-full max-w-lg px-4 py-10">
        <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-[#4a4a4a]">Предложения по улучшению</h1>
        <p class="mb-8 text-sm leading-relaxed text-gray-600">
            Напишите, что улучшить на сайте или о чём хотелось бы прочитать. Ваше обращение появится ниже; ответ администратора — ещё ниже.
        </p>

        <form class="space-y-4" @submit.prevent="onSubmit">
            <div>
                <label for="sug-name" class="mb-1.5 block text-sm font-medium text-gray-700">Как к вам обращаться</label>
                <input
                    id="sug-name"
                    v-model="name"
                    type="text"
                    maxlength="80"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#a79d1c] focus:ring-2 focus:ring-[#a79d1c]/30"
                />
            </div>
            <div>
                <label for="sug-email" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Email <span class="font-normal text-gray-400">(чтобы ответить)</span>
                </label>
                <input
                    id="sug-email"
                    v-model="email"
                    type="email"
                    maxlength="120"
                    autocomplete="email"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#a79d1c] focus:ring-2 focus:ring-[#a79d1c]/30"
                />
            </div>
            <div>
                <label for="sug-text" class="mb-1.5 block text-sm font-medium text-gray-700">Идея или замечание</label>
                <textarea
                    id="sug-text"
                    v-model="text"
                    required
                    rows="6"
                    maxlength="2000"
                    placeholder="Например: хочется тему про… / неудобно на телефоне…"
                    class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#a79d1c] focus:ring-2 focus:ring-[#a79d1c]/30"
                />
            </div>
            <button
                type="submit"
                :disabled="sending"
                class="inline-flex items-center justify-center rounded-lg bg-[#a79d1c]/90 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a79d1c] disabled:opacity-60"
            >
                {{ sending ? 'Отправляю…' : 'Отправить' }}
            </button>
        </form>

        <p v-if="message" class="mt-4 text-sm" :class="ok ? 'text-green-700' : 'text-red-700'">{{ message }}</p>

        <!-- Ваши обращения (над ответами) -->
        <section class="mt-12 border-t border-gray-200 pt-8">
            <h2 class="mb-4 text-xl font-bold text-[#4a4a4a]">Ваши обращения</h2>

            <p v-if="!search.userMe?.id" class="text-sm text-gray-600">
                <NuxtLink to="/admin" class="font-semibold text-[#a79d1c] underline-offset-2 hover:underline">Войдите</NuxtLink>,
                чтобы видеть свои обращения и ответы.
            </p>
            <p v-else-if="mineLoading" class="text-sm text-gray-500">Загружаю…</p>
            <p v-else-if="mine.length === 0" class="text-sm text-gray-500">
                Пока обращений нет — отправьте первое через форму выше.
            </p>
            <ul v-else class="space-y-3">
                <li
                    v-for="item in mine"
                    :key="item.id"
                    class="rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                    <p class="mb-1 text-xs text-gray-500">{{ formatWhen(item.at) }}</p>
                    <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{{ item.text }}</p>
                </li>
            </ul>
        </section>

        <!-- Ответы администратора -->
        <section class="mt-10 border-t border-gray-200 pt-8">
            <h2 class="mb-4 text-xl font-bold text-[#4a4a4a]">Ответы администратора</h2>

            <p v-if="!search.userMe?.id" class="text-sm text-gray-500">
                После входа здесь появятся ответы на ваши обращения.
            </p>
            <p v-else-if="mineLoading" class="text-sm text-gray-500">Загружаю…</p>
            <p v-else-if="repliedItems.length === 0" class="text-sm text-gray-500">
                Пока нет ответов. Как только администратор ответит — сообщение появится здесь.
            </p>
            <ul v-else class="space-y-4">
                <li
                    v-for="item in repliedItems"
                    :key="'reply-' + item.id"
                    class="rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-4"
                >
                    <p class="mb-1 text-xs text-gray-500">К обращению · {{ formatWhen(item.at) }}</p>
                    <p class="mb-3 whitespace-pre-wrap text-sm text-gray-600">{{ item.text }}</p>
                    <div class="rounded-lg border border-violet-200 bg-white px-3 py-3">
                        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-800">
                            Ответ администратора
                            <span v-if="item.repliedAt" class="font-normal normal-case text-gray-500">
                                · {{ formatWhen(item.repliedAt) }}
                            </span>
                        </p>
                        <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">{{ item.reply }}</p>
                    </div>
                </li>
            </ul>
        </section>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSearchStore } from '~/stores/search'

const search = useSearchStore()
const name = ref('')
const email = ref('')
const text = ref('')
const sending = ref(false)
const message = ref('')
const ok = ref(false)

const mine = ref([])
const mineLoading = ref(false)

const repliedItems = computed(() =>
    (mine.value || []).filter((s) => typeof s.reply === 'string' && s.reply.trim())
)

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

async function loadMine() {
    if (!search.userMe?.id) {
        mine.value = []
        return
    }
    mineLoading.value = true
    try {
        const token = localStorage.getItem('jwt')
        const res = await $fetch('/api/suggestions/mine', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        mine.value = Array.isArray(res?.suggestions) ? res.suggestions : []
    } catch {
        mine.value = []
    } finally {
        mineLoading.value = false
    }
}

onMounted(async () => {
    if (!search.userMe?.id) {
        try {
            await search.fetchUserMe()
        } catch {
            /* ignore */
        }
    }
    if (search.userMe?.username) name.value = search.userMe.username
    if (search.userMe?.email) email.value = search.userMe.email
    await loadMine()
})

async function onSubmit() {
    sending.value = true
    message.value = ''
    try {
        const token = localStorage.getItem('jwt')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await $fetch('/api/suggestions', {
            method: 'POST',
            headers,
            body: {
                name: name.value.trim(),
                email: email.value.trim(),
                text: text.value.trim()
            }
        })
        ok.value = true
        message.value = res?.message || 'Благодарю! Обращение сохранено!'
        text.value = ''
        await loadMine()
    } catch (e) {
        ok.value = false
        message.value = e?.data?.message || e?.message || 'Не удалось отправить. Попробуйте ещё раз.'
    } finally {
        sending.value = false
    }
}
</script>
