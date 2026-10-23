<template>
    <div v-if="!isLoggedIn"
        class="flex flex-col items-center justify-center -mt-40 h-screen max-w-md mx-auto">
        <!-- Вход -->
        <div v-if="index.authToggle" class="bg-white p-6 rounded-lg shadow-md w-full">
            <form @submit.prevent="login(userForma)" class="registration-form" id="loginForm">
                <h2 class="text-center text-2xl font-semibold mb-6">Вход</h2>
                <input v-model="userForma.email" type="email" id="email" placeholder="Email" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.password" type="password" id="password" placeholder="Пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit"
                    class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 cursor-pointer">Войти</button>
                <div v-if="loginError" class="error-message text-red-500 text-center mt-2">{{ loginError }}</div>
                <!-- Сообщение об успехе -->
                <div v-if="loginSuccessMessage" class="success-message text-green-500 text-center mt-2">{{
                    loginSuccessMessage }}</div>
            </form>
            <p>Нет аккаунта? <button @click="index.authToggle = false" class="cursor-pointer">Создать аккаунт</button>
            </p>
        </div>

        <!-- Регистрация -->
        <div v-else class="bg-white p-6 rounded-lg shadow-md w-full">
            <form @submit.prevent="registr" class="registration-form" id="registrationForm">
                <h2 class="text-center text-2xl font-semibold mb-6">Регистрация</h2>
                <!-- Имя пользователя -->
                <div class="mb-4">
                    <input v-model="userForma.username" type="text" id="username" placeholder="Имя пользователя"
                        required
                        class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                <input v-model="userForma.email" type="email" id="email" placeholder="Email" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.password" type="password" id="password" placeholder="Пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input type="password" id="confirmPassword" placeholder="Подтвердите пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit"
                    class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 cursor-pointer">Зарегистрироваться</button>
                <div v-if="registrationError" class="error-message text-red-500 text-center mt-2">{{ registrationError
                }}</div>
            </form>
            <p>Есть аккаунт? <button @click="index.authToggle = true" class="cursor-pointer">Войти</button></p>
        </div>
    </div>

    <div v-else class="mx-auto mt-10 max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-md">
        <div class="space-y-4 text-center">
            <h2 class="text-2xl font-semibold text-gray-800">Вы авторизованы</h2>
            <p class="text-sm text-gray-600">
                {{ index.userMe.username || index.userMe.email }}
                <span v-if="isContentAdmin" class="mt-1 block font-medium text-green-700">Администратор</span>
                <span v-else class="mt-1 block text-amber-700">Обычный пользователь (правки книги недоступны)</span>
            </p>
            <div class="flex flex-col gap-2">
                <NuxtLink
                    to="/contact"
                    class="rounded bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
                >
                    Открыть книгу (контакты)
                </NuxtLink>
                <NuxtLink
                    v-if="isContentAdmin"
                    to="/console"
                    class="rounded border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                >
                    Консоль
                </NuxtLink>
                <button
                    type="button"
                    class="rounded border border-red-200 px-4 py-2 text-sm text-red-800 hover:bg-red-50"
                    @click="logout"
                >
                    Выйти
                </button>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { STRAPI_BASE } from '~/utils/strapiBase'
import { canManageBlogContent } from '~/utils/strapiUserRole'
const index = useSearchStore();
const runtimeConfig = useRuntimeConfig();
const adminAllow = computed(() => ({
    emails: runtimeConfig.public.contentAdminEmails || '',
    usernames: runtimeConfig.public.contentAdminUsernames || '',
}));
const isLoggedIn = computed(() => Boolean(index.userMe?.id || index.userMe?.documentId));
const isContentAdmin = computed(() => canManageBlogContent(index.userMe, adminAllow.value));
const userForma = ref({
    username: '',
    email: '',
    password: ''
});
const newID = ref(0);
const router = useRouter();

function logout() {
    index.logout();
    router.push('/');
}

// Переменные для хранения сообщений об ошибках и успехе
const loginError = ref('');
const registrationError = ref('');
const loginSuccessMessage = ref(''); // Новое состояние для сообщения об успехе

const fetchUsers = async () => {
    try {
        const response = await $fetch(`${STRAPI_BASE}/api/users?fields=username&sort=username:desc`);
        const lastUser = response[0];

        if (lastUser && lastUser.username) {
            const match = lastUser.username.match(/\d+/);
            if (match) {
                newID.value = match[0];
            }
        }
    } catch (error) {
        console.warn(`Не вышло получить последний id пользователя: ${error}`);
    }
};

const registr = async () => {
    registrationError.value = ''; // Сброс сообщения об ошибке
    try {
        // Проверка минимальной длины имени пользователя
        if (userForma.value.username.length < 3) {
            registrationError.value = 'Имя пользователя должно содержать не менее 3 символов.';
            return;
        }

        await fetchUsers();
        if (newID) {
            const data = await $fetch(`${STRAPI_BASE}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    "username": userForma.value.username, // Используем введенное имя пользователя
                    "email": userForma.value.email,
                    "password": userForma.value.password
                },
            });

            if (!data?.jwt) {
                throw new Error('Регистрация: нет токена')
            }
            localStorage.setItem('jwt', data.jwt);
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
                            role: data.user.role,
                        })
                    )
                }
            } catch {
                /* ignore */
            }
            await index.fetchUserMe(data.user || null);

            router.push('/'); // Перенаправление на главную страницу после успешной регистрации
        }

    } catch (error) {
        registrationError.value = 'Ошибка при регистрации: ' + error.message; // Установка сообщения об ошибке
        console.error('Ошибка при регистрации:', error);
    } finally {
        userForma.value = {
            username: '',
            email: '',
            password: ''
        };
    }
}

const login = async (userForma) => {
    loginError.value = ''; // Сброс сообщения об ошибке
    try {
        const data = await $fetch(`${STRAPI_BASE}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                "identifier": userForma.email,
                "password": userForma.password
            },
        });

        if (!data?.jwt) {
            throw new Error('Нет токена в ответе')
        }
        localStorage.setItem('jwt', data.jwt);
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
                        role: data.user.role,
                    })
                )
            }
        } catch {
            /* ignore */
        }
        await index.fetchUserMe(data.user || null);

        // Показываем сообщение об успешном входе
        loginSuccessMessage.value = 'Вход выполнен успешно!';

        // Задержка перед перенаправлением
        setTimeout(() => {
            router.push('/'); // Перенаправление на главную страницу
        }, 2000); // Ждем 3 секунды

    } catch (error) {
        loginError.value = 'Ошибка при входе, неверно введённые данные'; // Установка сообщения об ошибке
        console.error('Ошибка при входе', error);
    }
}

</script>