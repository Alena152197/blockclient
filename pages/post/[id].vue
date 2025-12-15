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
                <li v-if="post" aria-current="page">
                    <div class="flex items-center text-gray-500 dark:text-gray-400">
                        <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span class="ms-1">{{ post?.title || 'Без названия' }}</span>
                    </div>
                </li>
            </ol>
        </nav>

        <!-- Фоновое изображение -->
        <div v-if="post?.img?.url" class="bg-no-repeat bg-top h-96 rounded-se-2xl my-10 bg-fixed bg-[length:50%_800px]"
            :style="{ backgroundImage: 'url(' + base_url + post.img.url + ')' }">
        </div>

        <!-- Заголовок и дата -->
        <div v-if="post">
            <h1 class="text-2xl font-bold mb-2">{{ post.title || 'Без названия' }}</h1>
            <p class="date text-gray-600">Дата публикации: <span>{{ formatDate() }}</span></p>
        </div>
        
        <!-- Сообщение об ошибке -->
        <div v-else class="text-center py-12">
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Статья не найдена или произошла ошибка при загрузке.
            </p>
            <NuxtLink to="/blog" 
                class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Вернуться к статьям
            </NuxtLink>
        </div>

        <!-- Контент -->
        <div v-if="post" class="ns_post mt-8" v-html="mark"></div>

        <!-- Секция комментариев -->
        <div v-if="post" class="mt-12 border-t pt-8">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Комментарии ({{ comments.length }})</h2>
            
            <!-- Форма добавления комментария -->
            <div class="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Оставить комментарий</h3>
                <div v-if="!search.userMe?.id" class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        Чтобы оставить комментарий, пожалуйста, 
                        <NuxtLink to="/admin" class="text-blue-600 dark:text-blue-400 hover:underline">войдите</NuxtLink> в систему.
                    </p>
                </div>
                <form v-else @submit.prevent="submitComment" class="space-y-4">
                    <div>
                        <label for="commentText" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ваш комментарий
                        </label>
                        <textarea
                            id="commentText"
                            v-model="newComment.text"
                            rows="4"
                            required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Напишите ваш комментарий..."
                        ></textarea>
                    </div>
                    <div class="flex items-center gap-4">
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span v-if="!isSubmitting">Отправить</span>
                            <span v-else>Отправка...</span>
                        </button>
                        <span v-if="commentError" class="text-sm text-red-600 dark:text-red-400">{{ commentError }}</span>
                        <span v-if="commentSuccess" class="text-sm text-green-600 dark:text-green-400">{{ commentSuccess }}</span>
                    </div>
                </form>
            </div>

            <!-- Список комментариев -->
            <div v-if="comments.length > 0" class="space-y-6">
                <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div class="flex items-start gap-4">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {{ comment.author?.username?.charAt(0).toUpperCase() || 'Г' }}
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="font-semibold text-gray-900 dark:text-white">
                                    {{ comment.author?.username || 'Гость' }}
                                </span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ formatCommentDate(comment.createdAt) }}
                                </span>
                            </div>
                            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ comment.text || comment.content || comment.message || comment.body || comment.commentText || comment.description || 'Комментарий без текста' }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Пока нет комментариев. Будьте первым!</p>
            </div>
        </div>
    </main>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import { ref, onMounted } from "vue";
import { useRoute, useHead } from "#app";
import { useSearchStore } from "~/stores/search";

const markdown = new MarkdownIt();
const mark = ref('');
const route = useRoute();
const base_url = 'https://324cbb377ef9.vps.myjino.ru';
const search = useSearchStore();

const post = ref(null);
const comments = ref([]);
const newComment = ref({ text: '' });
const isSubmitting = ref(false);
const commentError = ref('');
const commentSuccess = ref('');
const { id } = route.params;

// Загрузка данных статьи
const loadPost = async () => {
    try {
        // Загружаем пользователя если еще не загружен
        if (!search.userMe?.id) {
            const token = localStorage.getItem('jwt');
            if (token) {
                await search.fetchUserMe();
            }
        }

        // Загружаем пост (сначала без комментариев, чтобы избежать ошибок)
        const api = await $fetch(`${base_url}/api/posts/${id}?populate=*`);
        const postData = api.data;
        
        // Загружаем пользователя если еще не загружен (для комментариев)
        if (!search.userMe?.id) {
            const token = localStorage.getItem('jwt');
            if (token) {
                await search.fetchUserMe();
            }
        }
        
        // Загружаем пост (доступ открыт для всех)
        post.value = postData;
        if (post.value?.body) {
            mark.value = markdown.render(post.value.body);
        }
        
        // Инициализируем пустой массив комментариев
        // Комментарии будут загружаться отдельно или через форму отправки
        comments.value = [];
        
        // Пробуем загрузить комментарии, если они есть в посте
        if (post.value?.comments && Array.isArray(post.value.comments)) {
            comments.value = post.value.comments.sort((a, b) => 
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
        }
    } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
        post.value = null;
        comments.value = [];
    }
};

await loadPost();

// Отправка комментария
const submitComment = async () => {
    if (!newComment.value.text.trim()) return;
    
    isSubmitting.value = true;
    commentError.value = '';
    commentSuccess.value = '';
    
    try {
        const token = localStorage.getItem('jwt');
        if (!token) {
            commentError.value = 'Необходимо войти в систему';
            return;
        }
        
        // Получаем ID поста
        const postId = post.value?.id || post.value?.documentId || id;
        const postDocumentId = post.value?.documentId || id;
        const commentText = newComment.value.text.trim();
        
        // Пробуем разные форматы связей и названий полей
        let response;
        let lastError;
        
        // Варианты названий полей для текста комментария
        const textFields = ['text', 'content', 'message', 'body', 'comment', 'commentText', 'description', 'value'];
        
        // Варианты форматов для связей
        const relationFormats = [
            // Формат 1: просто ID
            { post: postDocumentId, author: search.userMe.id },
            // Формат 2: с documentId для поста
            { post: postId, author: search.userMe.id },
            // Формат 3: объект connect
            { post: { connect: [postDocumentId] }, author: { connect: [search.userMe.id] } },
            // Формат 4: объект set
            { post: { set: [postDocumentId] }, author: { set: [search.userMe.id] } },
        ];
        
        // Пробуем все комбинации
        for (const textField of textFields) {
            for (const relationFormat of relationFormats) {
                try {
                    const requestBody = {
                        data: {
                            [textField]: commentText,
                            ...relationFormat
                        }
                    };
                    
                    response = await fetch(`${base_url}/api/comments`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(requestBody)
                    });
                    
                    if (response.ok) {
                        console.log(`✅ Комментарий создан успешно! Поле: ${textField}, Формат связей:`, relationFormat);
                        commentSuccess.value = 'Комментарий успешно добавлен!';
                        newComment.value.text = '';
                        await loadPost();
                        setTimeout(() => { commentSuccess.value = ''; }, 3000);
                        return;
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        lastError = errorData;
                        // Не логируем каждую попытку, чтобы не засорять консоль
                    }
                } catch (e) {
                    // Игнорируем ошибки сети
                }
            }
        }
        
        // Если ничего не сработало, выводим подробную ошибку
        console.error('Все варианты создания комментария не сработали. Последняя ошибка:', lastError);
        const errorDetails = lastError?.error?.details || {};
        const errorMessage = lastError?.error?.message || lastError?.message || 'Неизвестная ошибка';
        
        // Формируем понятное сообщение для пользователя
        let userMessage = 'Не удалось отправить комментарий.\n\n';
        userMessage += `Ошибка: ${errorMessage}\n\n`;
        userMessage += 'Возможные причины:\n';
        userMessage += '1. Модель Comment не настроена в Strapi\n';
        userMessage += '2. Поле для текста комментария имеет другое название\n';
        userMessage += '3. Неправильно настроены связи post и author\n';
        userMessage += '4. Нет прав доступа на создание комментариев\n\n';
        userMessage += 'Проверьте настройки в админ-панели Strapi.';
        
        throw new Error(userMessage);
        
        commentSuccess.value = 'Комментарий успешно добавлен!';
        newComment.value.text = '';
        
        // Перезагружаем комментарии
        await loadPost();
        
        // Очищаем сообщение об успехе через 3 секунды
        setTimeout(() => {
            commentSuccess.value = '';
        }, 3000);
        
    } catch (error) {
        console.error('Ошибка при отправке комментария:', error);
        commentError.value = error.message || 'Не удалось отправить комментарий';
    } finally {
        isSubmitting.value = false;
    }
};

// Форматирование даты комментария
const formatCommentDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'} назад`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} назад`;
    if (days < 7) return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} назад`;
    
    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г.`;
};

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