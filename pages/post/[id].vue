<template>
    <main class="max-w-screen-lg min-w-96 md:min-w-[48rem] lg:min-w-[56rem] mx-auto py-2">
        <!-- Хлебные крошки -->
        <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse text-sm font-medium">
                <li class="inline-flex items-center">
                    <NuxtLink to="/blog"
                        class="inline-flex items-center text-black hover:text-blue-700 dark:text-white dark:hover:text-blue-300 font-semibold underline-offset-2 hover:underline">
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
                        <svg class="w-3 h-3 text-black dark:text-white mx-1" fill="none" stroke="currentColor" viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <NuxtLink :to="'/category/' + post.categories[0].documentId"
                            class="ms-1 text-black hover:text-blue-700 md:ms-2 dark:text-white dark:hover:text-blue-300 font-semibold underline-offset-2 hover:underline">
                            {{ post.categories[0].title }}
                        </NuxtLink>
                    </div>
                </li>

                <!-- Название поста -->
                <li v-if="post" aria-current="page">
                    <div class="flex items-center text-black dark:text-white">
                        <svg class="w-3 h-3 text-black dark:text-white mx-1" fill="none" stroke="currentColor" viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span class="ms-1 font-semibold">{{ post?.title || 'Без названия' }}</span>
                    </div>
                </li>
            </ol>
        </nav>

        <!-- Фоновое изображение -->
        <div v-if="post?.img?.url" 
            class="bg-no-repeat bg-center bg-contain rounded-se-2xl my-10 bg-fixed min-h-[600px] w-full"
            :style="{ 
                backgroundImage: 'url(' + base_url + post.img.url + ')',
                backgroundSize: 'contain',
                backgroundPosition: 'center center'
            }">
        </div>

        <!-- Заголовок и дата -->
        <div v-if="post">
            <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{{ post.title || 'Без названия' }}</h1>
            <p class="date text-gray-700 dark:text-gray-300">Дата публикации: <span>{{ formatDate() }}</span></p>
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
        <div v-if="post" class="ns_post mt-8 text-gray-900 dark:text-gray-100" v-html="mark"></div>

        <!-- Секция комментариев -->
        <div v-if="post" class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Комментарии ({{ comments.length }})</h2>
            
            <!-- Форма добавления комментария -->
            <div class="mb-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                <div v-if="!search.userMe?.id" class="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p class="text-sm text-gray-800 dark:text-gray-200">
                        Чтобы оставить комментарий, пожалуйста, 
                        <NuxtLink to="/admin" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline-offset-2 hover:underline transition-colors">войдите</NuxtLink> в систему.
                    </p>
                </div>
                <form v-else @submit.prevent="submitComment" class="space-y-4">
                    <div class="relative">
                        <textarea
                            id="commentText"
                            v-model="newComment.text"
                            rows="4"
                            required
                            class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder="Напишите ваш комментарий..."
                        ></textarea>
                    </div>
                    <div class="flex items-center gap-3 flex-wrap">
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium text-sm flex items-center gap-2"
                        >
                            <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span v-if="!isSubmitting">Отправить</span>
                            <span v-else class="flex items-center gap-2">
                                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Отправка...
                            </span>
                        </button>
                        <div class="flex items-center gap-2">
                            <span v-if="commentError" class="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ commentError }}
                            </span>
                            <span v-if="commentSuccess" class="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ commentSuccess }}
                            </span>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Список комментариев -->
            <div v-if="comments.length > 0" class="space-y-3">
                <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="group bg-gray-800 dark:bg-gray-800 p-4 rounded-xl border border-gray-700 dark:border-gray-700 hover:border-gray-600 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md"
                >
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0">
                            <NuxtLink 
                                :to="getAuthorProfileLink(comment)" 
                                class="block hover:opacity-80 transition-opacity"
                            >
                                <div v-if="getAuthorAvatar(comment)" class="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-md">
                                    <img 
                                        :src="getAuthorAvatar(comment)" 
                                        :alt="getAuthorName(comment)"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div v-else class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-white dark:ring-gray-800">
                                    {{ getAuthorInitial(comment) }}
                                </div>
                            </NuxtLink>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1.5">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <NuxtLink 
                                        :to="getAuthorProfileLink(comment)"
                                        class="font-semibold text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {{ getAuthorName(comment) }}
                                    </NuxtLink>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ formatCommentDate(comment.createdAt) }}
                                    </span>
                                </div>
                                <button
                                    v-if="isMyComment(comment)"
                                    @click="deleteComment(comment.id)"
                                    :disabled="isDeleting === comment.id"
                                    class="opacity-0 group-hover:opacity-100 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Удалить комментарий"
                                >
                                    <svg v-if="isDeleting !== comment.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span v-else class="text-xs">...</span>
                                </button>
                            </div>
                            <p class="text-white whitespace-pre-wrap text-sm leading-relaxed">{{ comment.Content || comment.content || comment.text || comment.message || comment.body || comment.commentText || comment.description || 'Комментарий без текста' }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400">
                <p class="text-sm">Пока нет комментариев. Будьте первым!</p>
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
const isDeleting = ref(null);
const commentError = ref('');
const commentSuccess = ref('');
const { id } = route.params;

// Функция для загрузки комментариев
const loadComments = async () => {
    try {
        const postId = post.value?.id;
        const postDocumentId = post.value?.documentId || id;
        
        // Сначала проверяем, есть ли комментарии в посте (если они загрузились через populate)
        if (post.value?.comments && Array.isArray(post.value.comments) && post.value.comments.length > 0) {
            const sortedComments = post.value.comments.sort((a, b) => 
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
            
            // Загружаем информацию об авторах с аватарами, если она не загружена
            for (const comment of sortedComments) {
                // Если автор - это строка и это текущий пользователь, используем его данные
                if (typeof comment.author === 'string' && search.userMe?.username === comment.author) {
                    comment.author = {
                        id: search.userMe.id,
                        username: search.userMe.username,
                        email: search.userMe.email,
                        avatar: search.userMe.avatar
                    };
                }
                // Если автор - это объект с id, но без аватара, загружаем его
                else if (typeof comment.author === 'object' && comment.author?.id && !comment.author?.avatar) {
                    try {
                        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                            const token = localStorage.getItem('jwt');
                            const userResponse = await fetch(`${base_url}/api/users/${comment.author.id}?populate=avatar`, {
                                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                            });
                            if (userResponse.ok) {
                                const userData = await userResponse.json();
                                comment.author = {
                                    ...comment.author,
                                    ...userData,
                                    avatar: userData.avatar
                                };
                            }
                        }
                    } catch (e) {
                        // Не удалось загрузить информацию об авторе
                    }
                }
                // Если автор - это строка (username), ищем пользователя по username
                else if (typeof comment.author === 'string') {
                    try {
                        // Проверяем, что мы на клиенте
                        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                            const token = localStorage.getItem('jwt');
                            const username = comment.author;
                            // Ищем пользователя по username
                            const userResponse = await fetch(`${base_url}/api/users?filters[username][$eq]=${encodeURIComponent(username)}&populate=avatar`, {
                                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                            });
                            if (userResponse.ok) {
                                const userData = await userResponse.json();
                                if (userData.data && userData.data.length > 0) {
                                    const user = userData.data[0];
                                    comment.author = {
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                        avatar: user.avatar
                                    };
                                }
                            }
                        }
                    } catch (e) {
                        // Не удалось загрузить информацию об авторе по username
                    }
                }
            }
            
            comments.value = sortedComments;
            return;
        }
        
        // Если комментарии не загрузились через populate, пробуем загрузить их отдельно
        // Пробуем загрузить с populate=post и populate=author с avatar
        try {
            // Проверяем, что мы на клиенте
            if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
                comments.value = [];
                return;
            }
            
            const token = localStorage.getItem('jwt');
            // Упрощенный вариант - используем populate=* для загрузки всех связей
            const allCommentsResponse = await fetch(`${base_url}/api/comments?populate=*`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            
            if (allCommentsResponse.ok) {
                const allCommentsData = await allCommentsResponse.json();
                
                if (allCommentsData?.data && Array.isArray(allCommentsData.data)) {
                    // Фильтруем комментарии по ID поста на клиенте
                    const filteredComments = allCommentsData.data.filter(comment => {
                        // post может быть объектом с id/documentId или просто числом/строкой
                        const commentPostId = comment.post?.id || comment.post?.documentId || comment.post;
                        const commentPostDocumentId = comment.post?.documentId;
                        
                        // Проверяем все возможные варианты сравнения
                        const matches = commentPostId === postId || 
                                       commentPostId === postDocumentId || 
                                       commentPostDocumentId === postDocumentId ||
                                       String(commentPostId) === String(postId) || 
                                       String(commentPostId) === String(postDocumentId) ||
                                       (commentPostId && String(commentPostId) === String(postId)) ||
                                       (commentPostId && String(commentPostId) === String(postDocumentId));
                        
                        return matches;
                    });
                    
                    if (filteredComments.length > 0) {
                        // Сортируем по дате создания (новые сначала)
                        const sortedComments = filteredComments.sort((a, b) => 
                            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                        );
                        
                        // ВАЖНО: Сохраняем все комментарии, которые были созданы для этого поста
                        // Даже если они потеряли связь в Strapi, мы сохраняем их локально
                        // Используем localStorage для сохранения комментариев с правильной связью
                        const storageKey = `post_${postId}_comments`;
                        
                        // Загружаем сохраненные комментарии из localStorage
                        let savedComments = [];
                        try {
                            const saved = localStorage.getItem(storageKey);
                            if (saved) {
                                savedComments = JSON.parse(saved);
                            }
                        } catch (e) {
                            // Не удалось загрузить сохраненные комментарии
                        }
                        
                        // Создаем Map для быстрого поиска по ID (приоритет новым данным из API)
                        const commentsMap = new Map();
                        
                        // Сначала добавляем сохраненные комментарии
                        savedComments.forEach(comment => {
                            if (comment.postId === postId || comment.postDocumentId === postDocumentId) {
                                commentsMap.set(comment.id, comment);
                            }
                        });
                        
                        // Затем добавляем/обновляем комментарии из API (они имеют приоритет)
                        // И загружаем информацию об авторах с аватарами
                        for (const newComment of sortedComments) {
                            if (newComment.post?.id === postId || newComment.post?.documentId === postDocumentId) {
                                // Если автор - это объект с id, но без полной информации, загружаем его отдельно
                                if (typeof newComment.author === 'object' && newComment.author?.id && !newComment.author?.avatar) {
                                    try {
                                        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                                            const token = localStorage.getItem('jwt');
                                            const userResponse = await fetch(`${base_url}/api/users/${newComment.author.id}?populate=avatar`, {
                                                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                                            });
                                            if (userResponse.ok) {
                                                const userData = await userResponse.json();
                                                newComment.author = {
                                                    ...newComment.author,
                                                    ...userData,
                                                    avatar: userData.avatar
                                                };
                                            }
                                        }
                                    } catch (e) {
                                        // Не удалось загрузить информацию об авторе
                                    }
                                }
                                // Если автор - это строка (username), ищем пользователя по username
                                else if (typeof newComment.author === 'string') {
                                    try {
                                        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                                            const token = localStorage.getItem('jwt');
                                            const username = newComment.author;
                                            // Ищем пользователя по username
                                            const userResponse = await fetch(`${base_url}/api/users?filters[username][$eq]=${encodeURIComponent(username)}&populate=avatar`, {
                                                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                                            });
                                            if (userResponse.ok) {
                                                const userData = await userResponse.json();
                                                if (userData.data && userData.data.length > 0) {
                                                    const user = userData.data[0];
                                                    newComment.author = {
                                                        id: user.id,
                                                        username: user.username,
                                                        email: user.email,
                                                        avatar: user.avatar
                                                    };
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        // Не удалось загрузить информацию об авторе по username
                                    }
                                }
                                
                                // Сохраняем комментарий с информацией о связи
                                const commentWithPost = {
                                    ...newComment,
                                    postId: newComment.post?.id || postId,
                                    postDocumentId: newComment.post?.documentId || postDocumentId
                                };
                                commentsMap.set(newComment.id, commentWithPost);
                            }
                        }
                        
                        // Преобразуем Map обратно в массив и сортируем
                        const allComments = Array.from(commentsMap.values()).sort((a, b) => 
                            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                        );
                        
                        // Сохраняем все комментарии в localStorage
                        try {
                            localStorage.setItem(storageKey, JSON.stringify(allComments));
                        } catch (e) {
                            // Не удалось сохранить комментарии
                        }
                        
                        // Сохраняем все комментарии
                        comments.value = allComments;
                        return;
                    }
                }
            }
        } catch (e) {
            // Не удалось загрузить все комментарии
        }
        
        comments.value = [];
    } catch (error) {
        comments.value = [];
    }
};

// Загрузка данных статьи (только пост, без комментариев и localStorage)
const loadPostData = async () => {
    try {
        // Загружаем пост с комментариями через populate
        // Пробуем разные варианты populate для комментариев с аватарами авторов
        let api;
        try {
            // Упрощенный вариант - загружаем пост без глубокого populate
            api = await $fetch(`${base_url}/api/posts/${id}?populate=*`);
        } catch (e) {
            try {
                api = await $fetch(`${base_url}/api/posts/${id}?populate[comments]=*`);
            } catch (e2) {
                try {
                    api = await $fetch(`${base_url}/api/posts/${id}`);
                } catch (e3) {
                    throw e3;
                }
            }
        }
        const postData = api.data;
        
        // Загружаем пост (доступ открыт для всех)
        post.value = postData;
        if (post.value?.body) {
            // Проверяем, является ли контент HTML (содержит теги)
            const body = post.value.body;
            if (body.includes('<') && body.includes('>')) {
                // Это HTML, отображаем напрямую
                mark.value = body;
            } else {
                // Это Markdown, обрабатываем через markdown.render
                mark.value = markdown.render(body);
            }
        }
        
        // Инициализируем пустой массив комментариев
        comments.value = [];
} catch (error) {
        post.value = null;
        comments.value = [];
    }
};

// Загрузка комментариев и пользователя (только на клиенте)
const loadPostWithComments = async () => {
    try {
        // Загружаем пользователя если еще не загружен
        if (!search.userMe?.id) {
            const token = localStorage.getItem('jwt');
            if (token) {
                await search.fetchUserMe();
            }
        }
        
        // Всегда загружаем комментарии отдельным запросом, так как они могут не загрузиться через populate
        await loadComments();
    } catch (error) {
        // Ошибка при загрузке комментариев
    }
};

// Загружаем пост на сервере (для SEO)
await loadPostData();

// Загружаем комментарии и пользователя на клиенте (как в profile.vue)
onMounted(() => {
    loadPostWithComments();
});

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
            isSubmitting.value = false;
            return;
        }
        
        if (!search.userMe?.id) {
            commentError.value = 'Ошибка: пользователь не найден';
            isSubmitting.value = false;
            return;
        }
        
        // Получаем ID поста - пробуем разные варианты
        const postId = post.value?.id;
        const postDocumentId = post.value?.documentId;
        const routeId = id;
        const commentText = newComment.value.text.trim();
        
        // Получаем ID пользователя (в userMe есть только id, нет documentId)
        const userId = search.userMe.id;
        
        if (!userId) {
            commentError.value = 'Ошибка: ID пользователя не найден';
            isSubmitting.value = false;
            return;
        }
        
        // Сначала попробуем получить информацию о модели Comment через API
        // или загрузить существующие комментарии, чтобы понять структуру
        try {
            const testResponse = await fetch(`${base_url}/api/comments?pagination[limit]=1&populate=*`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (e) {
            // Не удалось загрузить пример комментария
        }
        
        // В Strapi v4 для связей Many-to-One используется просто ID
        // Согласно структуре модели Comment в Strapi, поле для текста называется "Content" (с большой буквы)
        const textFields = ['Content', 'content', 'text', 'message', 'body', 'comment', 'commentText', 'description'];
        
        // Варианты ID для поста
        // Для связи Many-to-One в Strapi v4 нужно использовать числовой id, а не documentId
        const postIdVariants = [
            postId, // Используем числовой id сначала (правильный формат для связи)
            postDocumentId, // Пробуем documentId как запасной вариант
            routeId
        ].filter(Boolean);
        
        let lastError = null;
        let lastResponse = null;
        
        // Пробуем все комбинации полей и ID поста
        // author должен быть строкой (username), а не ID
        // post должен быть ID связи (Many-to-One)
        const authorVariants = [
            { author: search.userMe.username }, // Как текст (имя пользователя) - правильный вариант
            { author: search.userMe.email }, // Как текст (email пользователя) - запасной вариант
        ];
        
        // Варианты формата для связи post (Many-to-One)
        // В Strapi v4 для Many-to-One связи используется просто числовой id
        const postRelationFormats = (postIdValue) => {
            // Если это числовой id, используем его напрямую
            if (typeof postIdValue === 'number') {
                return [postIdValue]; // Просто числовой id - правильный формат
            }
            // Если это documentId (строка), пробуем разные варианты
            return [
                postIdValue, // Пробуем documentId как строку
                { connect: [postIdValue] },
                { set: [postIdValue] }
            ];
        };
        
        for (const textField of textFields) {
            for (const postIdValue of postIdVariants) {
                for (const authorVariant of authorVariants) {
                    for (const postRelationFormat of postRelationFormats(postIdValue)) {
                        try {
                            const requestBody = {
                                data: {
                                    [textField]: commentText,
                                    post: postRelationFormat,
                                    ...authorVariant,
                                    // Пробуем добавить Email, если поле существует
                                    Email: search.userMe.email || undefined
                                }
                            };
                        
                        // Удаляем undefined поля
                        Object.keys(requestBody.data).forEach(key => {
                            if (requestBody.data[key] === undefined) {
                                delete requestBody.data[key];
                            }
                        });
                        
                        const response = await fetch(`${base_url}/api/comments`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(requestBody)
                        });
                        
                        lastResponse = response;
                        
                        if (response.ok) {
                            const result = await response.json();
                            
                        commentSuccess.value = 'Комментарий успешно добавлен!';
                        newComment.value.text = '';
                        
                        // Сохраняем новый комментарий в localStorage сразу после создания
                        // Это гарантирует, что комментарий не потеряется, даже если связь в Strapi настроена неправильно
                        if (result?.data?.id) {
                            const storageKey = `post_${postId}_comments`;
                            try {
                                let savedComments = [];
                                const saved = localStorage.getItem(storageKey);
                                if (saved) {
                                    savedComments = JSON.parse(saved);
                                }
                                
                                // Добавляем новый комментарий с информацией о связи
                                const newCommentWithPost = {
                                    ...result.data,
                                    postId: postId,
                                    postDocumentId: postDocumentId,
                                    Content: commentText,
                                    author: search.userMe.username,
                                    Email: search.userMe.email,
                                    createdAt: result.data.createdAt || new Date().toISOString()
                                };
                                
                                // Удаляем старый комментарий с таким же ID, если есть
                                savedComments = savedComments.filter(c => c.id !== newCommentWithPost.id);
                                
                                // Добавляем новый комментарий
                                savedComments.push(newCommentWithPost);
                                
                                // Сохраняем обратно
                                localStorage.setItem(storageKey, JSON.stringify(savedComments));
                            } catch (e) {
                                // Не удалось сохранить комментарий в localStorage
                            }
                        }
                        
                        // Небольшая задержка перед перезагрузкой комментариев, чтобы Strapi успел обработать создание
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Перезагружаем комментарии после успешного создания
                        // Важно: загружаем заново, чтобы получить все комментарии с правильными связями
                        await loadComments();
                        
                        setTimeout(() => { commentSuccess.value = ''; }, 3000);
                        isSubmitting.value = false;
                        return;
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        lastError = errorData;
                        }
                    } catch (e) {
                        lastError = { error: { message: e.message } };
                    }
                }
            }
        }
    }
        
        const errorDetails = lastError?.error?.details || {};
        const errorMessage = lastError?.error?.message || lastError?.message || 'Неизвестная ошибка';
        const statusCode = lastResponse?.status || 'неизвестен';
        
        // Формируем понятное сообщение для пользователя
        let userMessage = 'Не удалось отправить комментарий.\n\n';
        userMessage += `Статус ответа: ${statusCode}\n`;
        userMessage += `Ошибка: ${errorMessage}\n\n`;
        
        if (errorDetails.errors) {
            userMessage += 'Детали ошибки:\n';
            errorDetails.errors.forEach((err, idx) => {
                userMessage += `${idx + 1}. ${err.message || err}\n`;
            });
            userMessage += '\n';
        }
        
        // Добавляем информацию о том, что было отправлено
        userMessage += 'Отправленные данные:\n';
        userMessage += `- ID поста: ${postDocumentId || postId || routeId}\n`;
        userMessage += `- ID пользователя: ${userId}\n`;
        userMessage += `- Текст комментария: ${commentText.substring(0, 50)}...\n\n`;
        
        userMessage += 'Возможные причины:\n';
        userMessage += '1. Поле для текста комментария имеет другое название (проверьте в Strapi)\n';
        userMessage += '2. Неправильно настроены связи post и author\n';
        userMessage += '3. Нет прав доступа на создание комментариев (проверьте Roles & Permissions)\n';
        userMessage += '4. ID поста или пользователя неверный\n\n';
        userMessage += 'Проверьте настройки в админ-панели Strapi.';
        
        throw new Error(userMessage);
        
    } catch (error) {
        commentError.value = error.message || 'Не удалось отправить комментарий';
    } finally {
        isSubmitting.value = false;
    }
};

// Получение аватара автора комментария
const getAuthorAvatar = (comment) => {
    // Если автор - это объект с аватаром
    if (typeof comment.author === 'object' && comment.author) {
        // Проверяем разные варианты структуры аватара
        if (comment.author.avatar?.url) {
            const avatarUrl = `${base_url}${comment.author.avatar.url}`;
            return avatarUrl;
        }
        // Если аватар - это объект с другими полями
        if (comment.author.avatar && typeof comment.author.avatar === 'object') {
            const avatarUrl = comment.author.avatar.url || comment.author.avatar.formats?.thumbnail?.url || comment.author.avatar.formats?.small?.url;
            if (avatarUrl) {
                const fullUrl = avatarUrl.startsWith('http') ? avatarUrl : `${base_url}${avatarUrl}`;
                return fullUrl;
            }
        }
    }
    
    // Если автор - это строка (username), проверяем, не это ли текущий пользователь
    if (typeof comment.author === 'string') {
        const authorUsername = comment.author;
        // Если это текущий пользователь, используем его аватар
        if (search.userMe?.username === authorUsername && search.userMe?.avatar?.url) {
            return `${base_url}${search.userMe.avatar.url}`;
        }
        // Если это текущий пользователь, используем его аватар
        if (search.userMe?.username === authorUsername && search.userMe?.avatar?.url) {
            return `${base_url}${search.userMe.avatar.url}`;
        }
        
        // Пытаемся загрузить аватар асинхронно (но это не сработает в computed, нужно использовать другой подход)
        // Для этого создадим отдельную функцию, которая будет вызываться при загрузке комментариев
    }
    
    return null;
};

// Получение имени автора комментария
const getAuthorName = (comment) => {
    if (typeof comment.author === 'string') {
        return comment.author;
    }
    return comment.author?.username || 'Гость';
};

// Получение инициала автора комментария
const getAuthorInitial = (comment) => {
    const name = getAuthorName(comment);
    return name.charAt(0).toUpperCase() || 'Г';
};

// Получение ссылки на профиль автора
const getAuthorProfileLink = (comment) => {
    // Всегда возвращаем ссылку на главную страницу "О БЛОГЕ"
    return '/';
};

// Проверка, принадлежит ли комментарий текущему пользователю
const isMyComment = (comment) => {
    if (!search.userMe?.id && !search.userMe?.username) return false;
    
    const commentAuthor = typeof comment.author === 'string' 
        ? comment.author 
        : comment.author?.username || comment.author?.id;
    
    // Сравниваем по username или id
    return commentAuthor === search.userMe.username || 
           commentAuthor === search.userMe.id ||
           comment.author?.id === search.userMe.id;
};

// Удаление комментария
const deleteComment = async (commentId) => {
    if (!commentId) return;
    
    // Подтверждение удаления
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) {
        return;
    }
    
    isDeleting.value = commentId;
    commentError.value = '';
    
    try {
        const token = localStorage.getItem('jwt');
        if (!token) {
            commentError.value = 'Необходимо войти в систему';
            isDeleting.value = null;
            return;
        }
        
        const response = await fetch(`${base_url}/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || 'Не удалось удалить комментарий';
            throw new Error(errorMessage);
        }
        
        // Удаляем комментарий из локального массива
        comments.value = comments.value.filter(c => c.id !== commentId);
        
        // Также удаляем из localStorage, если он там есть
        const postId = post.value?.id;
        if (postId) {
            try {
                const storageKey = `post_${postId}_comments`;
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    let savedComments = JSON.parse(saved);
                    savedComments = savedComments.filter(c => c.id !== commentId);
                    localStorage.setItem(storageKey, JSON.stringify(savedComments));
                }
            } catch (e) {
                // Не удалось обновить localStorage
            }
        }
        
        commentSuccess.value = 'Комментарий успешно удален';
        setTimeout(() => { commentSuccess.value = ''; }, 3000);
        
    } catch (error) {
        commentError.value = error.message || 'Не удалось удалить комментарий';
    } finally {
        isDeleting.value = null;
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
        // Проверяем, находится ли изображение в контейнере с выравниванием
        const parent = img.parentElement;
        if (parent && parent.tagName === 'DIV') {
            // Получаем выравнивание из стиля контейнера
            const textAlign = parent.style.textAlign || window.getComputedStyle(parent).textAlign || '';
            
            // Применяем базовые стили к изображению
            img.classList.add('max-w-[700px]', 'h-auto', 'block');
            
            // Применяем выравнивание в зависимости от text-align контейнера
            if (textAlign === 'left' || textAlign === 'start') {
                img.style.marginLeft = '0';
                img.style.marginRight = 'auto';
            } else if (textAlign === 'center' || textAlign === 'middle') {
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
            } else if (textAlign === 'right' || textAlign === 'end') {
                img.style.marginLeft = 'auto';
                img.style.marginRight = '0';
            } else {
                // Если выравнивание не указано, применяем стандартное (центр)
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
            }
            
            // Убеждаемся, что контейнер правильно отображается
            if (!parent.style.display || parent.style.display === '') {
                parent.style.display = 'block';
            }
            if (!parent.style.width || parent.style.width === '') {
                parent.style.width = '100%';
            }
        } else {
            // Если изображение не в контейнере, применяем стандартные стили
        img.classList.add('max-w-[700px]', 'h-auto', 'mx-auto', 'block');
        }
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
    color: #1a1a1a;
}

.dark h1,
.dark h2,
.dark h3,
.dark h4,
.dark h5,
.dark h6,
.dark .h1,
.dark .h2,
.dark .h3,
.dark .h4,
.dark .h5,
.dark .h6 {
    color: #e5e5e5;
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
    color: #1a1a1a;
}

.dark p {
    color: #e5e5e5;
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
    color: #4a5568;
}

.dark .text-muted {
    color: #a0aec0;
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

/* Улучшение контрастности текста в контенте поста */
.ns_post {
    color: #1a1a1a;
}

.dark .ns_post {
    color: #e5e5e5;
}

.ns_post p {
    color: #1a1a1a;
}

.dark .ns_post p {
    color: #e5e5e5;
}

/* Стили для контейнеров изображений с выравниванием */
.ns_post div[style*="text-align"] {
    display: block !important;
    width: 100% !important;
    margin: 10px 0 !important;
    clear: both;
}

.ns_post div[style*="text-align"] img {
    display: block !important;
    max-width: 100%;
    height: auto;
}

/* Выравнивание по левому краю - используем text-align родителя */
.ns_post div[style*="text-align: left"] img,
.ns_post div[style*="text-align:left"] img,
.ns_post div[style*="text-align: left;"] img,
.ns_post div[style*="text-align:left;"] img,
.ns_post div[style*="text-align"][style*="left"] img {
    margin-left: 0 !important;
    margin-right: auto !important;
}

/* Выравнивание по центру */
.ns_post div[style*="text-align: center"] img,
.ns_post div[style*="text-align:center"] img,
.ns_post div[style*="text-align: center;"] img,
.ns_post div[style*="text-align:center;"] img,
.ns_post div[style*="text-align"][style*="center"] img {
    margin-left: auto !important;
    margin-right: auto !important;
}

/* Выравнивание по правому краю */
.ns_post div[style*="text-align: right"] img,
.ns_post div[style*="text-align:right"] img,
.ns_post div[style*="text-align: right;"] img,
.ns_post div[style*="text-align:right;"] img,
.ns_post div[style*="text-align"][style*="right"] img {
    margin-left: auto !important;
    margin-right: 0 !important;
}

/* Стили для хлебных крошек - черный текст при светлой теме */
nav[aria-label="Breadcrumb"] a,
nav[aria-label="Breadcrumb"] span {
    color: #000000 !important;
}

.dark nav[aria-label="Breadcrumb"] a,
.dark nav[aria-label="Breadcrumb"] span {
    color: #ffffff !important;
}

nav[aria-label="Breadcrumb"] svg {
    color: #000000 !important;
}

.dark nav[aria-label="Breadcrumb"] svg {
    color: #ffffff !important;
}

/* Стили для текста комментариев - белый цвет для обеих тем */
.group > div > p,
.group p.text-white,
div.group p {
    color: #ffffff !important;
}

/* Убеждаемся, что все параграфы в комментариях белые */
.space-y-3 > div.group p {
    color: #ffffff !important;
}
</style>