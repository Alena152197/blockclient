<template>
    <main>
        <h1 class="text-2xl font-medium">Поиск</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-4">
            <article v-for="post in posts" :key="post.id" class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <NuxtLink class="block overflow-hidden" :to="'/post/' + post.documentId">
                    <img class="rounded-t-lg" :src="home+post.img.url" />
                </NuxtLink>
                <div class="p-5">
                    <NuxtLink :to="'/post/' + post.documentId">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ post.title }}</h5>
                    </NuxtLink>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ post.desc }}</p>
                    <NuxtLink :to="'/post/' + post.documentId" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white
                            bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Подробнее
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </NuxtLink>
                </div>
            </article>
        </div>
        <p v-if="posts.length === 0 && search.searchQuery">По вашему запросу ничего не найдено.</p>
    </main>
</template>

<script setup>
const search = useSearchStore();
const posts = ref([]);
const home = "https://324cbb377ef9.vps.myjino.ru";
const noPosts = ref(false)

async function searchAlert() {
    if (search.searchQuery) {
        try {
            const response = await $fetch(`${home}/api/posts?populate=*&filters[$or][0][title][$containsi]=${search.searchQuery}&filters[$or][1][body][$containsi]=${search.searchQuery}`);
            posts.value = response.data;
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            noPosts.value = true
        }
    } else {
        posts.value = [];
        noPosts.value = true
    }
}

watch(() => search.searchQuery, (newQuery) => {
    searchAlert();
});
</script>