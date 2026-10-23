<template>
    <div
        class="mx-auto flex h-screen max-w-md -mt-40 flex-col items-center justify-center"
    >
        <!-- Вход -->
        <div v-if="index.authToggle" class="w-full rounded-lg bg-white p-6 shadow-md">
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
            <p>
                Нет аккаунта?
                <button type="button" class="cursor-pointer" @click="index.authToggle = false">Создать аккаунт</button>
            </p>
        </div>

        <!-- Регистрация -->
        <div v-else class="w-full rounded-lg bg-white p-6 shadow-md">
            <form id="registrationForm" class="registration-form" @submit.prevent="registr">
                <h2 class="mb-6 text-center text-2xl font-semibold">Регистрация</h2>
                <div class="mb-4">
                    <input
                        id="username"
                        v-model="userForma.username"
                        type="text"
                        placeholder="Имя пользователя"
                        required
                        class="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <input
                    id="email-reg"
                    v-model="userForma.email"
                    type="email"
                    placeholder="Email"
                    required
                    class="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    id="password-reg"
                    v-model="userForma.password"
                    type="password"
                    placeholder="Пароль"
                    required
                    class="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Подтвердите пароль"
                    required
                    class="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    class="w-full cursor-pointer rounded bg-green-500 p-2 text-white transition duration-200 hover:bg-green-600"
                >
                    Зарегистрироваться
                </button>
                <div v-if="registrationError" class="error-message mt-2 text-center text-red-500">
                    {{ registrationError }}
                </div>
            </form>
            <p>
                Есть аккаунт?
                <button type="button" class="cursor-pointer" @click="index.authToggle = true">Войти</button>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { STRAPI_BASE } from '~/utils/strapiBase'

const index = useSearchStore()
const userForma = ref({
    username: '',
    email: '',
    password: ''
})
const newID = ref(0)
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
const registrationError = ref('')
const loginSuccessMessage = ref('')

const fetchUsers = async () => {
    try {
        const response = await $fetch(`${STRAPI_BASE}/api/users?fields=username&sort=username:desc`)
        const lastUser = response[0]

        if (lastUser && lastUser.username) {
            const match = lastUser.username.match(/\d+/)
            if (match) {
                newID.value = match[0]
            }
        }
    } catch (error) {
        console.warn(`Не вышло получить последний id пользователя: ${error}`)
    }
}

const registr = async () => {
    registrationError.value = ''
    try {
        if (userForma.value.username.length < 3) {
            registrationError.value = 'Имя пользователя должно содержать не менее 3 символов.'
            return
        }

        await fetchUsers()
        if (newID) {
            const data = await $fetch(`${STRAPI_BASE}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    username: userForma.value.username,
                    email: userForma.value.email,
                    password: userForma.value.password
                }
            })

            if (!data?.jwt) {
                throw new Error('Регистрация: нет токена')
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
                    registrationError.value = 'Этот email заблокирован. Регистрация недоступна.'
                    return
                }
            } catch {
                /* ignore */
            }
            await index.fetchUserMe(data.user || null)
            router.replace('/')
        }
    } catch (error) {
        registrationError.value = 'Ошибка при регистрации: ' + error.message
        console.error('Ошибка при регистрации:', error)
    } finally {
        userForma.value = {
            username: '',
            email: '',
            password: ''
        }
    }
}

const login = async (form) => {
    loginError.value = ''
    loginSuccessMessage.value = ''
    try {
        const data = await $fetch(`${STRAPI_BASE}/api/auth/local`, {
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
