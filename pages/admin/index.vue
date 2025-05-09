<template>
    <div v-if="!index.userMe.documentId"
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

    <div v-else class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6 mt-10">

        <div class="text-center">
            <h2 class="text-2xl font-semibold text-gray-800">Вы авторизованы</h2>
        </div>

    </div>


</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const index = useSearchStore();
const userForma = ref({
    username: '',
    email: '',
    password: ''
});
const newID = ref(0);
const router = useRouter();

// Переменные для хранения сообщений об ошибках и успехе
const loginError = ref('');
const registrationError = ref('');
const loginSuccessMessage = ref(''); // Новое состояние для сообщения об успехе

const fetchUsers = async () => {
    try {
        const response = await $fetch('https://324cbb377ef9.vps.myjino.ru/api/users?fields=username&sort=username:desc');
        const lastUser = response[0];

        if (lastUser && lastUser.username) {
            const match = lastUser.username.match(/\d+/);
            if (match) {
                newID.value = match[0];
            }
        }
    } catch (error) {
        console.log(`Не вышло получить последний id пользователя: ${error}`);
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
        console.log(newID.value);
        if (newID) {
            const response = await $fetch(`https://324cbb377ef9.vps.myjino.ru/api/auth/local/register`, {
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

            const data = await response;
            localStorage.setItem('jwt', data.jwt);

            if (!response.ok) {
                index.userMe = data.user;
            }

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
        const response = await $fetch(`https://324cbb377ef9.vps.myjino.ru/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                "identifier": userForma.email,
                "password": userForma.password
            },
        });

        const data = await response;
        localStorage.setItem('jwt', data.jwt);

        if (!response.ok) {
            index.userMe = data.user;
        }

        // Показываем сообщение об успешном входе
        loginSuccessMessage.value = 'Вход выполнен успешно!';

        // Задержка перед перенаправлением
        setTimeout(() => {
            router.push('/'); // Перенаправление на главную страницу
        }, 2000); // Ждем 3 секунды

    } catch (error) {
        loginError.value = 'Ошибка при входе, неверно введённые данные'; // Установка сообщения об ошибке
        console.error('Ошибка при входе');
    }
}

</script>