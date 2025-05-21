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
                                d="M10.707 1.707a1 1 0 0 0-1.414 0l-7 7A1 1 0 0 0 3 10h1v6a1 1 0 0 0 1 1h4v-4h2v4h4a1 1 0 0 0 1-1v-6h1a1 1 0 0 0 .707-1.707l-7-7z" />
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
        <div v-if="post?.img?.url" class="bg-no-repeat bg-top h-96 rounded-se-2xl my-10 bg-fixed bg-[length:50%_800px]"
            :style="{ backgroundImage: 'url(' + base_url + post.img.url + ')' }">
        </div>

        <!-- Заголовок и дата -->
        <div>
            <h1 class="text-2xl font-bold mb-2">{{ post.title || 'Без названия' }}</h1>
            <p class="date text-gray-600">Дата публикации: <span>{{ formatDate() }}</span></p>
        </div>

        <!-- Контент -->
        <div class="ns_post mt-8" v-html="mark"></div>
    </main>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import { ref, onMounted } from "vue";
import { useRoute, useHead } from "#app";

const markdown = new MarkdownIt();
const mark = ref('');
const route = useRoute();
const base_url = 'https://324cbb377ef9.vps.myjino.ru';

const post = ref(null);
const { id } = route.params;

// Загрузка данных статьи
try {
    const api = await $fetch(`${base_url}/api/posts/${id}?populate=*`);
    post.value = api.data;
    if (post.value.body) {
        mark.value = markdown.render(post.value.body);
    }
} catch (error) {
    console.error('Ошибка при загрузке поста:', error);
}

// Форматирование даты
function formatDate() {
    if (!post.value?.publishedAt) return 'Дата отсутствует...';
    const date = new Date(post.value.publishedAt);
    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} г.`;
}

// Заголовок страницы
useHead(() => ({
    title: `${post.value?.title || 'Без названия'} - Блог`,
}));

// Стилизация изображений в контенте
onMounted(() => {
    document.querySelectorAll('.ns_post img').forEach(img => {
        img.classList.add('max-w-[700px]', 'h-auto', 'mx-auto', 'block');
    });
});
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