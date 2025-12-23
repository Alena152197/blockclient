<template>
    <div class="">
        <h2 class="text-4xl font-extrabold my-4 mb-6 p-1 text-[#4a4a4a] dark:text-white text-center">Мои интересы</h2>
        
        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="relative">
                <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        </div>

        <!-- Сообщение если нет статей -->
        <div v-else-if="posts.length === 0" class="text-center py-12">
            <p class="text-xl text-gray-800 dark:text-gray-200">
                Статей пока нет.
            </p>
        </div>

        <!-- Список статей -->
        <div v-else class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mb-6 justify-self-center">
            <article v-for="post in displayedPosts" :key="post.id"
                class="max-w-sm overflow-hidden bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative group">
                <!-- Кнопка удаления (показывается при наведении) -->
                <button
                    @click.stop="deletePost(post.id, post.documentId)"
                    :disabled="isDeleting === post.id"
                    class="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Удалить пост"
                >
                    <svg v-if="isDeleting !== post.id" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span v-else class="text-xs">...</span>
                </button>
                <NuxtLink class="block overflow-hidden" :to="'/post/' + post.documentId">
                    <!-- Добавляем класс для изображений -->
                    <img v-if="post.img && post.img.url" 
                        class="rounded-t-lg w-full h-36 object-cover" 
                        :src="base_url + post.img.url"
                        :alt="post.img.alternativeText || post.title" />
                    <div v-else class="rounded-t-lg w-full h-36 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span class="text-gray-400 dark:text-gray-500 text-sm">Нет изображения</span>
                    </div>
                </NuxtLink>
                <div class="p-4">
                    <NuxtLink :to="'/post/' + post.documentId">
                        <h5 class="mb-3 text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">{{
                            post.title }}</h5>
                    </NuxtLink>
                    <p class="mb-3 font-normal text-gray-800 dark:text-gray-200">{{ post.desc }}</p>
                    <NuxtLink :to="'/post/' + post.documentId"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#a79d1c]/50 rounded-lg hover:bg-[#a79d1c] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Подробнее
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </NuxtLink>
                </div>
            </article>
        </div>
        <button v-if="posts.length > 0 && !(displayedPosts.length === posts.length)" @click="loadMore" type="button"
            class="block m-auto w-40 my-8 bg-[#a79d1c]/50 text-[#a79d1c] hover:text-white border border-[#a79d1c] hover:brightness-90 focus:ring-4 focus:outline-none focus:ring-[#a79d1c] font-black rounded-lg text-base py-4 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
            Смотреть еще
        </button>
        
        <!-- Сообщения об ошибках и успехе -->
        <div v-if="deleteError" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {{ deleteError }}
        </div>
        <div v-if="deleteSuccess" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {{ deleteSuccess }}
        </div>
    </div>
</template>



<script setup>
import { useSearchStore } from '~/stores/search';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const search = useSearchStore();
const router = useRouter();
const base_url = "https://324cbb377ef9.vps.myjino.ru";

const posts = ref([]);
const displayedPosts = ref([]);
const isLoading = ref(true);
const isDeleting = ref(null);
const deleteError = ref('');
const deleteSuccess = ref('');

// Загрузка всех постов
const loadPosts = async () => {
    isLoading.value = true;
    try {
        // Загружаем все посты с информацией об авторе
        const allPosts = await $fetch(`${base_url}/api/posts?populate=*&sort=createdAt:desc`);
        if (allPosts.data && Array.isArray(allPosts.data)) {
            posts.value = allPosts.data;
        } else {
            posts.value = [];
        }
        
        displayedPosts.value = posts.value.slice(0, 8);
    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
        posts.value = [];
        displayedPosts.value = [];
    } finally {
        isLoading.value = false;
    }
};

const loadMore = () => {
    displayedPosts.value = posts.value.slice(0, displayedPosts.value.length + 4);
}

// Проверка, является ли пост принадлежащим текущему пользователю
const isMyPost = (post) => {
    // Проверяем разные варианты структуры автора
    const postAuthorId = post.author?.id || post.author?.data?.id || post.author;
    const postAuthorDocumentId = post.author?.documentId;
    
    // Сравниваем по ID (число или строка)
    return postAuthorId === search.userMe?.id || 
           postAuthorDocumentId === search.userMe?.id ||
           String(postAuthorId) === String(search.userMe?.id) ||
           (post.author && typeof post.author === 'object' && post.author.id === search.userMe?.id);
};

// Удаление поста
const deletePost = async (postId, postDocumentId) => {
    if (!postId && !postDocumentId) return;
    
    // Подтверждение удаления
    if (!confirm('Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.')) {
        return;
    }
    
    isDeleting.value = postId;
    deleteError.value = '';
    deleteSuccess.value = '';
    
    try {
        const token = localStorage.getItem('jwt');
        
        // Используем documentId если есть, иначе id
        const idToDelete = postDocumentId || postId;
        
        const response = await fetch(`${base_url}/api/posts/${idToDelete}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || 'Не удалось удалить пост';
            throw new Error(errorMessage);
        }
        
        // Удаляем пост из списков
        posts.value = posts.value.filter(p => p.id !== postId && p.documentId !== postDocumentId);
        displayedPosts.value = displayedPosts.value.filter(p => p.id !== postId && p.documentId !== postDocumentId);
        
        deleteSuccess.value = 'Пост успешно удален';
        setTimeout(() => { deleteSuccess.value = ''; }, 3000);
        
    } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        deleteError.value = error.message || 'Не удалось удалить пост';
        setTimeout(() => { deleteError.value = ''; }, 5000);
    } finally {
        isDeleting.value = null;
    }
};

// Загружаем посты на клиенте
onMounted(async () => {
    await loadPosts();
});
</script>

<style scoped>
h2 {
    color: #4a4a4a !important;
}
</style>
