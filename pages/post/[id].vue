<template>

    <!-- <nav>
        <ul>
            <li>
                <NuxtLink to="/blog">Блог</NuxtLink>
            </li>
            <li>
                <NuxtLink :style="'background:' + post.categories[0].bg"
                    :to="'/category/' + post.categories[0].documentId">
                    {{ post.categories[0].title }}</NuxtLink>
            </li>
            <li><strong>{{ post.title }}</strong></li>
        </ul>
    </nav> -->
    <!--тело статьи-->


    <main class="max-w-screen-xl min-w-96 md:min-w-[48rem] lg:min-w-[56rem] mx-auto py-2">
        <!--хлебные крошки-->
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
                <li>
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


        <div class="bg-no-repeat bg-top h-96 rounded-se-2xl my-10 bg-fixed bg-[length:50%_800px]"
            :style="'background-image: url(' + base_url + post.img[0].url + ')'"></div>
        <div class="px-8">
            <strong>
                <h1>{{ post.title }}</h1>
            </strong>
            <p class="date">Дата публикации: <span>{{ post.publishedAt }}</span> </p> <br>
        </div>

        <div class="dateText" v-html="mark"></div>

        <!-- <img :src=base_url+post.img[0].url :alt=post.img[0].alternativeText> -->
    </main>
</template>

<script setup>
import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt();
const mark = ref('')

const { id } = useRoute().params

const api = await $fetch(`https://324cbb377ef9.vps.myjino.ru/api/posts/${id}?populate=*`);
const post = api.data;
mark.value = markdown.render(post.body);


const base_url = 'https://324cbb377ef9.vps.myjino.ru'

const apiConfic = await $fetch(`${base_url}/api/config?populate=*`)
const config = apiConfic.data

useHead({
    title: `${post.title} - ${config.title}`
})
</script>