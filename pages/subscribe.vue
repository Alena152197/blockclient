<template>
    <main class="mx-auto w-full max-w-lg px-4 py-10">
        <div v-if="checking" class="py-12 text-center text-sm text-gray-500">Проверяю подписку…</div>

        <template v-else-if="!subscribed">
            <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-[#4a4a4a]">Подписаться</h1>
            <p class="mb-8 text-sm leading-relaxed text-gray-600">
                Оставьте email — я буду присылать заметки о новых статьях и разворотах блога. Без спама, отписка в один клик.
            </p>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <div>
                    <label for="sub-email" class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="sub-email"
                        v-model="email"
                        type="email"
                        required
                        autocomplete="email"
                        placeholder="you@example.com"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#a79d1c] focus:ring-2 focus:ring-[#a79d1c]/30"
                    />
                </div>
                <button
                    type="submit"
                    :disabled="sending"
                    class="inline-flex items-center justify-center rounded-lg bg-[#a79d1c]/90 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a79d1c] disabled:opacity-60"
                >
                    {{ sending ? 'Отправляю…' : 'Подписаться' }}
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
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await $fetch('/api/subscribe/status', {
            headers,
            query: { email: e }
        })
        subscribed.value = Boolean(res?.subscribed)
        return subscribed.value
    } catch {
        subscribed.value = false
        return false
    }
}

async function leaveIfSubscribed() {
    if (!subscribed.value) return
    notifyNav(true)
    await router.replace('/unsubscribe')
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
        if (search.userMe?.email) {
            email.value = search.userMe.email
        }
        const okSub = await checkStatus(email.value)
        if (okSub) {
            await leaveIfSubscribed()
        }
    } finally {
        checking.value = false
    }
})

async function onSubmit() {
    sending.value = true
    message.value = ''
    try {
        const token = localStorage.getItem('jwt')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const { detectClientCountry } = await import('~/utils/clientCountry')
        const geo = await detectClientCountry()
        const res = await $fetch('/api/subscribe', {
            method: 'POST',
            headers,
            body: {
                email: email.value.trim(),
                countryCode: geo.code || undefined,
                country: geo.name || undefined
            }
        })
        ok.value = true
        subscribed.value = true
        message.value = res?.message || 'Благодарю! Вы подписались.'
        notifyNav(true)
        await router.replace('/')
    } catch (e) {
        ok.value = false
        message.value = e?.data?.message || e?.message || 'Не удалось сохранить. Попробуйте ещё раз.'
    } finally {
        sending.value = false
    }
}
</script>
