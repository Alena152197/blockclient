<template>
    <div v-if="!index.userMe.documentId"
        class="flex flex-col items-center justify-center -mt-40 h-screen max-w-md mx-auto">
        <!-- Вход -->
        <div v-if="index.authToggle" class="bg-white p-6 rounded-lg shadow-md w-full">
            <form @submit.prevent="login" class="registration-form" id="loginForm">
                <h2 class="text-center text-2xl font-semibold mb-6">Вход</h2>
                <input v-model="userForma.email" type="email" id="email" placeholder="Email" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.password" type="password" id="password" placeholder="Пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit"
                    class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 cursor-pointer">Войти</button>
                <div class="error-message text-red-500 text-center mt-2" id="errorMessage"></div>
            </form>
            <p>Нет аккаунта? <button @click="index.authToggle = false" class="cursor-pointer">Создать аккаунт</button>
            </p>
        </div>

        <!-- Регистрация -->
        <div v-else class="bg-white p-6 rounded-lg shadow-md w-full">
            <form @submit.prevent="registr" class="registration-form" id="registrationForm">
                <h2 class="text-center text-2xl font-semibold mb-6">Регистрация</h2>
                <input v-model="userForma.email" type="email" id="email" placeholder="Email" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.password" type="password" id="password" placeholder="Пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.confirmPassword" type="password" id="confirmPassword"
                    placeholder="Подтвердите пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit"
                    class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 cursor-pointer">Зарегистрироваться</button>
                <div class="error-message text-red-500 text-center mt-2" id="errorMessage"></div>
            </form>
            <p>Есть аккаунт? <button @click="index.authToggle = true" class="cursor-pointer">Войти</button></p>
        </div>
    </div>
    <div v-else class="text-center mx-1.5">
        Вы авторизованы, <button @click="index.logout"
            class="cursor-pointer border-1 rounded bg-white p-1">Выйти</button>

        <ul>
            <li>Email: {{ index.userMe.email }}</li>
        </ul>
    </div>
</template>

<script setup>

const index = useSearchStore();
const userForma = ref({
    email: '',
    password: '',
    confirmPassword: ''
});
const newID = ref(0);
const router = useRouter(); // Создаем экземпляр router

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
        console.log(`Не удалось получить последний id пользователя: ${error}`);
    }
};

const login = async () => {
    try {
        await index.login(userForma.value); // Предполагается, что метод login возвращает Promise
        router.push('/'); // Перенаправление на главную страницу после успешного входа
    } catch (error) {
        document.getElementById('errorMessage').innerText = error.message; // Отображение сообщения об ошибке
    }
};

const registr = async () => {
    try {
        await fetchUsers();
        console.log(newID.value);

        // Проверка на совпадение паролей
        if (userForma.value.password !== userForma.value.confirmPassword) {
            document.getElementById('errorMessage').innerText = "Пароли не совпадают.";
            return;
        }

        if (newID.value) {
            const response = await $fetch(`https://324cbb377ef9.vps.myjino.ru/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    "username": `id${+newID.value + 1}`,
                    "email": userForma.value.email,
                    "password": userForma.value.password
                },
            });

            const data = await response;
            localStorage.setItem('jwt', data.jwt);
            userForma.value = { email: '', password: '', confirmPassword: '' }; // Сброс формы только после успешной регистрации
            document.getElementById('errorMessage').innerText = ""; // Очистка сообщения об ошибке
        } else {
            throw new Error("Не удалось получить новый ID пользователя.");
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        document.getElementById('errorMessage').innerText = error.message; // Отображение сообщения об ошибке
    }
}
</script>
