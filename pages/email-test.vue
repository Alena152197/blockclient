<template>
    <form @submit.prevent="sendEmail">
        <input v-model="email" type="email" placeholder="Введите ваш email" required />
        <button type="submit">Отправить тестовое письмо</button>
    </form>

    <div>{{ result }}</div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const result = ref('')

async function sendEmail() {
    result.value = 'Отправляем письмо...';
    try {
        const response = await fetch('https://324cbb377ef9.vps.myjino.ru/email-test/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value }),  // <--- здесь
        });

        const data = await response.json();
        if (response.ok) {
            result.value = data.message;
        } else {
            result.value = 'Ошибка: ' + data.message;
        }
    } catch (error) {
        result.value = 'Ошибка сети: ' + error.message;
    }
}

</script>
