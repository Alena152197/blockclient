<template>
    <div
        class="mx-auto flex h-screen max-w-md -mt-40 flex-col items-center justify-center"
    >
        <div class="w-full rounded-lg bg-white p-6 shadow-md">
            <form id="loginForm" class="registration-form" @submit.prevent="login(userForma)">
                <h2 class="mb-6 text-center text-2xl font-semibold">Вход</h2>
                <input
                    id="email"
                    v-model="userForma.email"
                    type="email"
                    placeholder="Email"
                    required
                    class="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    id="password"
                    v-model="userForma.password"
                    type="password"
                    placeholder="Пароль"
                    required
                    class="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    class="w-full cursor-pointer rounded bg-green-500 p-2 text-white transition duration-200 hover:bg-green-600"
                >
                    Войти
                </button>
                <div v-if="loginError" class="error-message mt-2 text-center text-red-500">{{ loginError }}</div>
                <div v-if="loginSuccessMessage" class="success-message mt-2 text-center text-green-500">
                    {{ loginSuccessMessage }}
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { resolveStrapiBase } from '~/utils/strapiBase'

const index = useSearchStore()
const userForma = ref({
    email: '',
    password: ''
})
const router = useRouter()

const isLoggedIn = computed(() => Boolean(index.userMe?.id || index.userMe?.documentId))

function leaveIfLoggedIn() {
    if (isLoggedIn.value) {
        router.replace('/')
    }
}

watch(isLoggedIn, leaveIfLoggedIn)

onMounted(async () => {
    try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('jwt') && !index.userMe?.id) {
            await index.fetchUserMe()
        }
    } catch {
        /* ignore */
    }
    leaveIfLoggedIn()
})

const loginError = ref('')
const loginSuccessMessage = ref('')

const login = async (form) => {
    loginError.value = ''
    loginSuccessMessage.value = ''
    try {
        const strapi = resolveStrapiBase()
        if (!strapi) {
            loginError.value =
                'Не задан адрес Strapi (NUXT_PUBLIC_STRAPI_URL). На VPS проверьте .env и пересоберите сайт.'
            return
        }
        const data = await $fetch(`${strapi}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                identifier: form.email,
                password: form.password
            }
        })

        if (!data?.jwt) {
            throw new Error('Нет токена в ответе')
        }
        localStorage.setItem('jwt', data.jwt)
        try {
            if (data.user) {
                localStorage.setItem(
                    'strapi_auth_user',
                    JSON.stringify({
                        id: data.user.id,
                        documentId: data.user.documentId,
                        username: data.user.username,
                        email: data.user.email,
                        avatar: data.user.avatar,
                        role: data.user.role
                    })
                )
            }
        } catch {
            /* ignore */
        }

        try {
            const ban = await $fetch('/api/blocked/status', {
                headers: { Authorization: `Bearer ${data.jwt}` }
            })
            if (ban?.blocked) {
                index.logout()
                loginError.value = 'Ваш доступ к сайту ограничен администратором.'
                return
            }
        } catch {
            /* middleware поймает */
        }

        await index.fetchUserMe(data.user || null)
        router.replace('/')
    } catch (error) {
        loginError.value = 'Ошибка при входе, неверно введённые данные'
        console.error('Ошибка при входе', error)
    }
}
</script>
