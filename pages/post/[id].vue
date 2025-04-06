<template>
    <main class="max-w-screen-lg min-w-96 md:min-w-[48rem] lg:min-w-[56rem] mx-auto py-2">
        <!-- Хлебные крошки -->
        <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center">
                    <NuxtLink to="/blog"
                        class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                        Блог
                    </NuxtLink>
                </li>
                <li v-if="post.categories && post.categories.length > 0">
                    <div class="flex items-center">
                        <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <NuxtLink :to="'/category/' + post.categories[0].documentId"
                            class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                            {{ post.categories[0].title }}
                        </NuxtLink>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"><strong>{{
                            post.title }}</strong></span>
                    </div>
                </li>
            </ol>
        </nav>

        <!-- Фоновое изображение -->
        <div v-if="post.img && post.img.url"
            class="bg-no-repeat bg-top h-96 rounded-se-2xl my-10 bg-fixed bg-[length:50%_800px]"
            :style="'background-image: url(' + base_url + post.img.url + ')'"></div>

        <!-- Заголовок и дата -->
        <div>
            <strong>
                <h1>{{ post.title || 'Без названия' }}</h1>
            </strong>
            <p class="date">Дата публикации: <span>{{ formatDate() }}</span></p>
            <br>
        </div>

        <!-- Основной контент -->
        <div class="ns_post" v-html="mark"></div>
    </main>
</template>

<script setup>
import MarkdownIt from "markdown-it";
const markdown = MarkdownIt();
const mark = ref('');

// Получение параметров маршрута
const { id } = useRoute().params;

// Базовый URL API
const base_url = 'https://324cbb377ef9.vps.myjino.ru';

onMounted(() => {
    document.querySelectorAll('.ns_post img').forEach(img => {
        img.classList.add('max-w-[700px]', 'h-auto', 'mx-auto', 'block'); // Tailwind CSS классы
    });
});

// Загрузка данных
let post, config;
try {
    const api = await $fetch(`${base_url}/api/posts/${id}?populate=*`);
    const apiConfig = await $fetch(`${base_url}/api/config?populate=*`);

    post = api.data;
    config = apiConfig.data;

    // Рендеринг Markdown
    mark.value = post.body ? markdown.render(post.body) : '';
} catch (error) {
    console.error('Ошибка при загрузке данных:', error);
}

// Форматирование даты
function formatDate() {
    try {
        if (!post.publishedAt) return 'Дата отсутствует...';

        const date = new Date(post.publishedAt);
        const months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];

        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        return `${day} ${month} ${year} г.`;
    } catch (error) {
        console.error(error);
        return 'Дата отсутствует...';
    }
}

// Установка заголовка страницы
useHead({
    title: `${post?.title || 'Без названия'} - ${config?.title || 'Без конфигурации'}`
});
</script>

<style scoped>

/* Стили для заголовков */
h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
    font-family: Arial, sans-serif;
    font-weight: bold;
    line-height: 1.5;
    color: #333;
}

h1, .h1 { font-size: 2em; margin: 1.5em 0 0.75em; }
h2, .h2 { font-size: 1.75em; margin: 1.5em 0 0.75em; }
h3, .h3 { font-size: 1.5em; margin: 1.5em 0 0.75em; }
h4, .h4 { font-size: 1.25em; margin: 0.75em 0; }
h5, .h5 { font-size: 1em; margin: 0.75em 0; }
h6, .h6 { font-size: 0.875em; margin: 0.75em 0; }

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
small, .small {
    font-size: 0.85em;
}

mark, .mark {
    background-color: #ffeb3b;
    padding: 0.2em;
}

/* Цветовые стили */
.text-muted { color: #6c757d; }
.text-primary { color: #007bff; }
.text-success { color: #28a745; }
.text-info { color: #17a2b8; }
.text-warning { color: #ffc107; }
.text-danger { color: #dc3545; }

/* Фоновые цвета */
.bg-primary { color: #fff; background-color: #007bff; }
.bg-success { background-color: #28a745; }
.bg-info { background-color: #17a2b8; }
.bg-warning { background-color: #ffc107; }
.bg-danger { background-color: #dc3545; }
</style>