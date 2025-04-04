<template>

    <div v-if="!index.userMe.documentId" class="flex flex-col items-center justify-center -mt-40 h-screen max-w-md mx-auto">
        <!-- Вход -->
        <div v-if="index.authToggle" class="bg-white p-6 rounded-lg shadow-md w-full">
            <form @submit.prevent="index.login(userForma)" class="registration-form" id="loginForm">
                <h2 class="text-center text-2xl font-semibold mb-6">Вход</h2>
                <input v-model="userForma.email" type="email" id="email" placeholder="Email" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.password" type="password" id="password" placeholder="Пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit"
                    class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 cursor-pointer">Войти</button>
                <div class="error-message text-red-500 text-center mt-2" id="errorMessage"></div>
            </form>
            <p>Нет ааканута? <button @click="index.authToggle = false" class="cursor-pointer">Создать аакаунт</button></p>
        </div>

        <!-- Регистрация -->
        <div v-else class="bg-white p-6 rounded-lg shadow-md w-full">
            <form @submit.prevent="registr" class="registration-form" id="registrationForm">
                <h2 class="text-center text-2xl font-semibold mb-6">Регистрация</h2>
                <input v-model="userForma.email" type="email" id="email" placeholder="Email" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input v-model="userForma.password" type="password" id="password" placeholder="Пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <input type="password" id="confirmPassword" placeholder="Подтвердите пароль" required
                    class="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                <button type="submit"
                    class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 cursor-pointer">Зарегистрироваться</button>
                <div class="error-message text-red-500 text-center mt-2" id="errorMessage"></div>
            </form>
            <p>Есть аккаунт? <button @click="index.authToggle = true" class="cursor-pointer">Войди</button></p>
        </div>
    </div>
    <div v-else class="text-center mx-1.5">
        Вы авторизованы, <button @click="index.logout" class="cursor-pointer border-1 rounded bg-white p-1">Выйти</button>

        <ul>
            <li>Email: {{ index.userMe.email }}</li>
        </ul>
    </div>

    

</template>

<script setup>
const index = useSearchStore();
const userForma = ref({})
const newID = ref(0)

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
    try {
        await fetchUsers()
        console.log(newID.value);
        if (newID) {
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
        }

    } catch (error) {
        console.error('Ошибка при обновлении просмотров:', error);
    } finally {
        userForma.value = {}
    }
}
</script>