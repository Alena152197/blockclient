<template>
    <main class="mx-auto w-full max-w-lg px-4 py-10">
        <div v-if="checking" class="py-12 text-center text-sm text-gray-500">Проверяю подписку…</div>

        <template v-else-if="!subscribed">
            <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-[#4a4a4a]">Вы не подписаны</h1>
            <p class="mb-6 text-sm text-gray-600">Сейчас вас нет в списке рассылки.</p>
            <NuxtLink
                to="/subscribe"
                class="inline-flex rounded-lg bg-[#a79d1c]/90 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a79d1c]"
            >
                Подписаться
            </NuxtLink>
        </template>

        <template v-else>
            <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-[#4a4a4a]">Отписаться</h1>
            <p class="mb-6 text-sm leading-relaxed text-gray-600">
                Жаль, если рассылка больше не нужна. Напишите, пожалуйста, почему уходите — это поможет улучшить блог.
            </p>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <div>
                    <label for="unsub-email" class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="unsub-email"
                        v-model="email"
                        type="email"
                        required
                        autocomplete="email"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#a79d1c] focus:ring-2 focus:ring-[#a79d1c]/30"
                    />
                </div>
                <div>
                    <label for="unsub-reason" class="mb-1.5 block text-sm font-medium text-gray-700">
                        Причина отписки
                    </label>
                    <textarea
                        id="unsub-reason"
                        v-model="reason"
                        required
                        rows="5"
                        maxlength="2000"
                        placeholder="Например: слишком часто / темы не заходят / подписалась по ошибке…"
                        class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#a79d1c] focus:ring-2 focus:ring-[#a79d1c]/30"
                    />
                </div>
                <button
                    type="submit"
                    :disabled="sending"
                    class="inline-flex w-full items-center justify-center rounded-lg border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60"
                >
                    {{ sending ? 'Отписываю…' : 'Отписаться' }}
                </button>
            </form>

            <p v-if="message" class="mt-4 text-sm" :class="ok ? 'text-green-700' : 'text-red-700'">{{ message }}</p>
        </template>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSearchStore } from '~/stores/search'

const router = useRouter()
const search = useSearchStore()
const email = ref('')
const reason = ref('')
const sending = ref(false)
const message = ref('')
const ok = ref(false)
const subscribed = ref(false)
const checking = ref(true)

function notifyNav(subscribedFlag) {
    if (import.meta.client) {
        window.dispatchEvent(
            new CustomEvent('blog-subscribe-changed', { detail: { subscribed: subscribedFlag } })
        )
    }
}

async function checkStatus(emailValue) {
    const e = String(emailValue || '').trim()
    if (!e || !e.includes('@')) {
        subscribed.value = false
        return false
    }
    try {
        const token = localStorage.getItem('jwt')
        const res = await $fetch('/api/subscribe/status', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            query: { email: e }
        })
        subscribed.value = Boolean(res?.subscribed)
        return subscribed.value
    } catch {
        subscribed.value = false
        return false
    }
}

onMounted(async () => {
    checking.value = true
    try {
        if (!search.userMe?.id) {
            try {
                await search.fetchUserMe()
            } catch {
                /* guest */
            }
        }
        if (search.userMe?.email) email.value = search.userMe.email
        await checkStatus(email.value)
        notifyNav(subscribed.value)
    } finally {
        checking.value = false
    }
})

async function onSubmit() {
    sending.value = true
    message.value = ''
    try {
        const token = localStorage.getItem('jwt')
        const { detectClientCountry } = await import('~/utils/clientCountry')
        const geo = await detectClientCountry()
        const res = await $fetch('/api/subscribe/unsubscribe', {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: {
                email: email.value.trim(),
                reason: reason.value.trim(),
                countryCode: geo.code || undefined,
                country: geo.name || undefined
            }
        })
        ok.value = true
        message.value = res?.message || 'Вы отписались.'
        subscribed.value = false
        notifyNav(false)
        setTimeout(() => {
            router.replace('/')
        }, 1200)
    } catch (e) {
        ok.value = false
        message.value = e?.data?.message || e?.message || 'Не удалось отписаться.'
    } finally {
        sending.value = false
    }
}
</script>
