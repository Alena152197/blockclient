<template>

    <main>
        <h2 class="text-4xl font-extrabold my-4 dark:text-white">Блог</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-4">
            <article v-for="post in displayedPosts" :key="post.id"
                class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <NuxtLink class="block overflow-hidden" :to="'/post/' + post.documentId">
                    <img class="rounded-t-lg" :src="base_url + post.img[0].url" :alt=post.img[0].alternativeText />
                </NuxtLink>
                <div class="p-5">
                    <NuxtLink :to="'/post/' + post.documentId">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ post.title
                            }}</h5>
                    </NuxtLink>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ post.desc }}</p>
                    <NuxtLink :to="'/post/' + post.documentId"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
        <button v-if="!(displayedPosts.length === posts.length)" @click="loadMore" type="button"
            class="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Смотреть
            еще</button>
    </main>
</template>



<script setup>
const api = await $fetch('http://localhost:1337/api/posts?populate=*')
const posts = api.data

const displayedPosts = ref(posts.slice(0, 6));
const loadMore = () => {
    displayedPosts.value = posts.slice(0, displayedPosts.value.length + 6);
}

const base_url = "http://localhost:1337"
</script>


