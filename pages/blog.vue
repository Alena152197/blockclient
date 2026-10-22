<template>
    <div
        class="blog-page-root relative flex w-full min-h-0 flex-1 flex-col"
        :class="interestsBgState?.url ? 'blog-page--custom-bg' : 'min-h-[calc(100vh-9rem)]'"
    >
        <div v-if="interestsBgState?.url" class="blog-page-bg" aria-hidden="true">
            <img
                class="blog-page-bg-img"
                :src="interestsBgState.url"
                alt=""
                sizes="100vw"
                decoding="async"
                fetchpriority="low"
                :style="interestsBgImageStyle"
            />
            <div class="blog-page-bg-overlay" :style="customInterestsBgOverlayStyle" />
        </div>
        <div class="relative z-10 w-full min-w-0 max-w-full">
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

        <!-- Список статей: блок по центру, одинаковые отступы слева и справа -->
        <div
            v-else
            class="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14"
        >
            <div :class="[postsGridClass, 'mb-6']">
            <article
                v-for="post in displayedPosts"
                :key="post.id"
                class="flex h-full min-h-0 w-full max-w-sm flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative group"
            >
                <button
                    v-if="canDeletePosts"
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

                <NuxtLink class="block shrink-0 overflow-hidden" :to="'/post/' + post.documentId">
                    <img
                        v-if="post.img && post.img.url"
                        class="h-60 w-full rounded-t-lg object-cover sm:h-56"
                        :src="base_url + post.img.url"
                        :alt="post.img.alternativeText || post.title"
                    />
                    <div
                        v-else
                        class="flex h-60 items-center justify-center rounded-t-lg bg-gray-200 dark:bg-gray-700 sm:h-56"
                    >
                        <span class="text-sm text-gray-400 dark:text-gray-500">Нет изображения</span>
                    </div>
                </NuxtLink>
                <div class="flex min-h-0 flex-1 flex-col p-3">
                    <NuxtLink class="shrink-0" :to="'/post/' + post.documentId">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100 line-clamp-2">{{
                            post.title }}</h5>
                    </NuxtLink>
                    <p
                        class="mb-2 line-clamp-2 text-sm font-normal leading-snug text-gray-700 dark:text-gray-300"
                    >
                        {{ stripCoverFromDesc(post.desc) }}
                    </p>
                    <NuxtLink
                        :to="'/post/' + post.documentId"
                        class="mt-auto inline-flex shrink-0 items-center self-start px-3 py-2 text-sm font-medium text-center text-white bg-[#a79d1c]/50 rounded-lg hover:bg-[#a79d1c] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
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
            <button
                v-if="canLoadMore"
                @click="loadMore"
                type="button"
                class="block mx-auto w-40 my-8 bg-[#a79d1c]/50 text-[#a79d1c] hover:text-white border border-[#a79d1c] hover:brightness-90 focus:ring-4 focus:outline-none focus:ring-[#a79d1c] font-black rounded-lg text-base py-4 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
                Смотреть еще
            </button>
        </div>
        
        <!-- Сообщения об ошибках и успехе -->
        <div v-if="deleteError" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {{ deleteError }}
        </div>
        <div v-if="deleteSuccess" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {{ deleteSuccess }}
        </div>
        </div>
    </div>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { stripCoverFromDesc } from '~/utils/postCoverLayout';
import {
    loadPageBgState,
    buildCustomBgImageStyle,
    buildCustomBgOverlayStyle
} from '~/utils/blogIndexBg';
import { sortPostsList, POSTS_INTERESTS_GRID_CLASS } from '~/utils/blogPostsLayout';
import { useSearchStore } from '~/stores/search';
import { canManageBlogContent } from '~/utils/strapiUserRole';
import { STRAPI_BASE } from '~/utils/strapiBase'

const search = useSearchStore();
const canDeletePosts = computed(() => canManageBlogContent(search.userMe));

const interestsBgState = ref(null);

function loadInterestsBackground() {
    interestsBgState.value = loadPageBgState('interests');
}

/** Фон — один экран (fixed + 100dvh); режим вписывания — из настроек (cover / contain / fill), см. «Вписать в экран» */
const interestsBgImageStyle = computed(() => buildCustomBgImageStyle(interestsBgState.value));
const customInterestsBgOverlayStyle = computed(() => buildCustomBgOverlayStyle(interestsBgState.value));

function onInterestsPageBgChanged() {
    loadInterestsBackground();
}

const posts = ref([]);
const isLoading = ref(true);
const isDeleting = ref(null);
const deleteError = ref('');
const deleteSuccess = ref('');

const postsGridClass = POSTS_INTERESTS_GRID_CLASS;

const sortedPosts = computed(() => sortPostsList(posts.value, 'newest'));
const postsPageSize = ref(8);

const displayedPosts = computed(() => sortedPosts.value.slice(0, postsPageSize.value));

const canLoadMore = computed(() => sortedPosts.value.length > postsPageSize.value);

const base_url = STRAPI_BASE;

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
        
        postsPageSize.value = 8;
    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
        posts.value = [];
    } finally {
        isLoading.value = false;
    }
};

const loadMore = () => {
    postsPageSize.value += 4;
};

// Удаление поста
const deletePost = async (postId, postDocumentId) => {
    if (!postId && !postDocumentId) return;
    if (!canManageBlogContent(search.userMe)) {
        deleteError.value = 'Удалять посты может только администратор.';
        setTimeout(() => { deleteError.value = ''; }, 4000);
        return;
    }

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
        
        posts.value = posts.value.filter(p => p.id !== postId && p.documentId !== postDocumentId);

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
    if (!process.client) return;
    try {
        if (localStorage.getItem('jwt') && !search.userMe?.id) {
            await search.fetchUserMe();
        }
    } catch {
        /* ignore */
    }
    loadInterestsBackground();
    window.addEventListener('interests-page-bg-changed', onInterestsPageBgChanged);
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('interests-page-bg-changed', onInterestsPageBgChanged);
    }
});
</script>

<style scoped>
/*
 * Фон «Мои интересы»: один размер с окном браузера (fixed + 100dvh), не растягивается на всю длину списка.
 * object-fit задаётся в настройках фона (cover / contain / fill); подложка #141414 видна в полях при contain.
 */
.blog-page-root.blog-page--custom-bg {
    width: 100%;
    min-width: 0;
}

/* Непрозрачная подложка страницы под контентом при прокрутке */
.blog-page--custom-bg {
    background-color: #141414;
}

/* Один экран: фон не движется с прокруткой, всегда «перед глазами» целиком */
.blog-page--custom-bg .blog-page-bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    background-color: #141414;
}

.blog-page-bg-img {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    max-width: none;
    background-color: #141414;
    pointer-events: none;
    user-select: none;
}

.blog-page-bg-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

h2 {
    color: #4a4a4a !important;
}
</style>
