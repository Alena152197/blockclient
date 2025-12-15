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
            <p class="text-xl text-gray-600 dark:text-gray-400">
                Статей пока нет.
            </p>
        </div>

        <!-- Список статей -->
        <div v-else class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mb-6 justify-self-center">
            <article v-for="post in displayedPosts" :key="post.id"
                class="max-w-sm overflow-hidden bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <NuxtLink class="block overflow-hidden" :to="'/post/' + post.documentId">
                    <!-- Добавляем класс для изображений -->
                    <img class="rounded-t-lg w-full h-36 object-cover" :src="base_url + post.img.url"
                        :alt="post.img.alternativeText" />
                </NuxtLink>
                <div class="p-4">
                    <NuxtLink :to="'/post/' + post.documentId">
                        <h5 class="mb-3 text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">{{
                            post.title }}</h5>
                    </NuxtLink>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ post.desc }}</p>
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

// Загрузка всех постов
const loadPosts = async () => {
    isLoading.value = true;
    try {
        // Загружаем все посты
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

// Загружаем посты на клиенте
onMounted(() => {
    loadPosts();
});
</script>

<style scoped>
h2 {
    color: #4a4a4a !important;
}
</style>
