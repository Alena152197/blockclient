<template>
    <main>
        <h2 class="text-4xl font-extrabold my-4">{{ categoryTitle }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-4">
            <article v-for="post in displayedPosts" :key="post.id"
                class="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                <NuxtLink class="block overflow-hidden" :to="'/post/' + post.documentId">
                    <!-- Проверяем разные варианты структуры изображения -->
                    <img v-if="(post.img && Array.isArray(post.img) && post.img.length > 0 && post.img[0]?.url) || (post.img && post.img.url)" 
                        class="rounded-t-lg w-full h-36 object-cover" 
                        :src="base_url + (Array.isArray(post.img) ? post.img[0].url : post.img.url)" 
                        :alt="(Array.isArray(post.img) ? post.img[0]?.alternativeText : post.img?.alternativeText) || post.title" />
                    <div v-else class="rounded-t-lg w-full h-36 bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-400 text-sm">Нет изображения</span>
                    </div>
                </NuxtLink>
                <div class="p-5">
                    <NuxtLink :to="'/post/' + post.documentId">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ post.title
                            }}</h5>
                    </NuxtLink>
                    <p class="mb-3 font-normal text-gray-700">{{ stripCoverFromDesc(post.desc) }}</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <NuxtLink :to="'/post/' + post.documentId"
                            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                            Подробнее
                            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </NuxtLink>
                        <PostShareButton
                            :post-id="post.documentId || post.id"
                            :title="post.title"
                        />
                    </div>
                </div>
            </article>
        </div>
        <button v-if="!(displayedPosts.length === posts.length)" @click="loadMore" type="button"
            class="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Смотреть
            еще</button>
    </main>
</template>

<script setup>
import { stripCoverFromDesc } from '~/utils/postCoverLayout'
import { STRAPI_BASE } from '~/utils/strapiBase'

const base_url = STRAPI_BASE
const { id } = useRoute().params
const { data: categoryPayload } = await useAsyncData(
    `category-${id}`,
    () =>
        $fetch(`${STRAPI_BASE}/api/categories/${id}?populate=posts.img&populate=posts.categories`).catch(
            () => null
        )
)
const categoryTitle = categoryPayload.value?.data?.title || ''
const posts = categoryPayload.value?.data?.posts || []

const displayedPosts = ref(posts.slice(0, 3));
const loadMore = () => {
    displayedPosts.value = posts.slice(0, displayedPosts.value.length + 3);
}

</script>

