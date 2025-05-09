<template>
    <main class="max-w-screen-lg min-w-96 md:min-w-[48rem] lg:min-w-[56rem] mx-auto py-2">
        <!-- Хлебные крошки -->
        <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse text-sm font-medium">
                <li class="inline-flex items-center">
                    <NuxtLink to="/blog"
                        class="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        <svg class="w-3 h-3 me-2.5" viewBox="0 0 20 20" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="m19.707 9.293-2-2-7-7a1 0 0 0-1.414 0l-7 7-2 2a1 0 0 0 1.414 1.414L2 10.414V18a2 0 0 0 2 2h3a1 0 0 0 1-1v-4a1 0 0 1 1-1h2a1 0 0 1 1 1v4a1 0 0 0 1 1h3a2 0 0 0 2-2v-7.586l.293.293a1 0 0 0 1.414-1.414Z" />
                        </svg>
                        Блог
                    </NuxtLink>
                </li>

                <!-- Категория -->
                <li v-if="post?.categories && post.categories.length > 0">
                    <div class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <NuxtLink :to="'/category/' + post.categories[0].documentId"
                            class="ms-1 text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                            {{ post.categories[0].title }}
                        </NuxtLink>
                    </div>
                </li>

                <!-- Название поста -->
                <li aria-current="page">
                    <div class="flex items-center text-gray-500 dark:text-gray-400">
                        <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span class="ms-1">{{ post.title || 'Без названия' }}</span>
                    </div>
                </li>
            </ol>
        </nav>

        <!-- Фоновое изображение -->
        <div v-if="post.img && post.img.url"
            class="bg-no-repeat bg-top h-96 rounded-se-2xl my-10 bg-fixed bg-[length:50%_800px]"
            :style="{ backgroundImage: 'url(' + base_url + post.img.url + ')' }">
        </div>

        <!-- Заголовок и дата -->
        <div>
            <h1 class="text-2xl font-bold mb-2">{{ post.title || 'Без названия' }}</h1>
            <p class="date text-gray-600">Дата публикации: <span>{{ formatDate() }}</span></p>
        </div>

        <!-- Контент -->
        <div class="ns_post mt-8" v-html="mark"></div>

        <!-- Комментарии -->
        <section class="mt-16">
            <h2 class="text-xl font-bold mb-4">Комментарии</h2>

            <!-- Форма добавления -->
            <form @submit.prevent="submitComment" class="mb-8 p-4 border rounded-md bg-gray-50">
                <div class="mb-4">
                    <label for="author" class="block text-sm font-medium mb-1">Имя</label>
                    <input v-model="newComment.author" id="author" type="text" required
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="newComment.email" id="email" type="email" required
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div class="mb-4">
                    <label for="content" class="block text-sm font-medium mb-1">Ваш комментарий</label>
                    <textarea v-model="newComment.content" id="content" rows="4" required
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
                </div>
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                    Оставить комментарий
                </button>
            </form>

            <!-- Список комментариев -->
            <div v-if="comments.length > 0" class="space-y-4">
                <div v-for="comment in comments" :key="comment.id"
                    class="border-t pt-4 pb-2 px-2 hover:bg-gray-100 transition">
                    <p class="font-semibold">{{ comment.attributes.author }}</p>
                    <p class="text-gray-600 text-sm mb-1">{{ comment.attributes.email }}</p>
                    <p>{{ comment.attributes.content }}</p>
                </div>
            </div>
            <p v-else class="italic text-gray-500">Нет комментариев. Будьте первым!</p>
        </section>
    </main>
</template>


<script setup>
import MarkdownIt from "markdown-it";
import { ref, onMounted } from "vue";
import { useRoute, useHead } from "#app";

const markdown = new MarkdownIt();
const mark = ref('');
const route = useRoute();

// Реактивные данные формы и комментариев
const newComment = ref({
    author: '',
    email: '',
    content: ''
});
const comments = ref([]);

const { id } = route.params;
const base_url = 'https://324cbb377ef9.vps.myjino.ru';

let post = null;

// Загрузка данных статьи
try {
    const api = await $fetch(`${base_url}/api/posts/${id}?populate=*`);
    post = api.data;
    if (post.body) mark.value = markdown.render(post.body);
} catch (error) {
    console.error('Ошибка при загрузке поста:', error);
}

// Форматирование даты
function formatDate() {
    if (!post?.publishedAt) return 'Дата отсутствует...';
    const date = new Date(post.publishedAt);
    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} г.`;
}

// Установка заголовка страницы
useHead({
    title: `${post?.title || 'Без названия'} - Блог`
});

// При монтировании компонента загружаем комментарии
onMounted(async () => {
    document.querySelectorAll('.ns_post img').forEach(img => {
        img.classList.add('max-w-[700px]', 'h-auto', 'mx-auto', 'block');
    });

    await loadComments();
});

// Загрузка комментариев к посту
async function loadComments() {
    try {
        const res = await $fetch(`${base_url}/api/comments?filters[post][id][$eq]=${id}&sort=createdAt:asc`);
        comments.value = res.data || [];
    } catch (err) {
        console.error('Не удалось загрузить комментарии:', err);
        comments.value = [];
    }
}

// Отправка нового комментария
async function submitComment() {
    if (!newComment.value.author || !newComment.value.email || !newComment.value.content) {
        alert("Пожалуйста, заполните все поля");
        return;
    }

    try {
        const response = await $fetch(`${base_url}/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    author: newComment.value.author,
                    email: newComment.value.email,
                    content: newComment.value.content,
                    post: Number(id) // ❗ ОЧЕНЬ ВАЖНО: преобразование в число
                }
            })
        });

        comments.value.push(response.data);
        newComment.value = { author: '', email: '', content: '' };
        alert("Комментарий успешно отправлен!");
    } catch (error) {
        console.error('Ошибка при отправке:', error);

        if (error.response && error.response._data) {
            console.error('Детали ошибки:', error.response._data);
            alert('Ошибка: ' + JSON.stringify(error.response._data));
        } else {
            alert('Не удалось отправить комментарий.');
        }
    }
}
</script>


<style scoped>
/* Стили для заголовков */
h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3,
.h4,
.h5,
.h6 {
    font-family: Arial, sans-serif;
    font-weight: bold;
    line-height: 1.5;
    color: #333;
}

h1,
.h1 {
    font-size: 2em;
    margin: 1.5em 0 0.75em;
}

h2,
.h2 {
    font-size: 1.75em;
    margin: 1.5em 0 0.75em;
}

h3,
.h3 {
    font-size: 1.5em;
    margin: 1.5em 0 0.75em;
}

h4,
.h4 {
    font-size: 1.25em;
    margin: 0.75em 0;
}

h5,
.h5 {
    font-size: 1em;
    margin: 0.75em 0;
}

h6,
.h6 {
    font-size: 0.875em;
    margin: 0.75em 0;
}

/* Стили для текста */
p {
    margin: 0 0 0.75em;
}

.lead {
    margin-bottom: 1.5em;
    font-size: 1.15em;
    font-weight: 300;
    line-height: 1.4;
}

@media (min-width: 576px) {
    .lead {
        font-size: 1.5em;
    }
}

/* Выделение текста */
small,
.small {
    font-size: 0.85em;
}

mark,
.mark {
    background-color: #ffeb3b;
    padding: 0.2em;
}

/* Цветовые стили */
.text-muted {
    color: #6c757d;
}

.text-primary {
    color: #007bff;
}

.text-success {
    color: #28a745;
}

.text-info {
    color: #17a2b8;
}

.text-warning {
    color: #ffc107;
}

.text-danger {
    color: #dc3545;
}

/* Фоновые цвета */
.bg-primary {
    color: #fff;
    background-color: #007bff;
}

.bg-success {
    background-color: #28a745;
}

.bg-info {
    background-color: #17a2b8;
}

.bg-warning {
    background-color: #ffc107;
}

.bg-danger {
    background-color: #dc3545;
}
</style>