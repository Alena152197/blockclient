<template>
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
            :style="'background-image: url(' + base_url + post.img.url + ')'"></div>
        <div class="px-8">
            <strong>
                <h1>{{ post.title }}</h1>
            </strong>
            <p class="date">Дата публикации: <span>{{ formatDate() }}</span> </p> <br>
        </div>

        <div class=" ns_post" v-html="mark"></div>

        <!-- <img :src=base_url+post.img[0].url :alt=post.img[0].alternativeText> -->
    </main>
</template>

<script setup>
import MarkdownIt from "markdown-it";
const markdown = MarkdownIt();
const mark = ref('')

const { id } = useRoute().params

const api = await $fetch(`https://324cbb377ef9.vps.myjino.ru/api/posts/${id}?populate=*`);
const post = api.data;
mark.value = markdown.render(post.body);


function formatDate() {
    try {
        // Предполагаем, что post.publishedAt — это строка в формате ISO 8601
        const date = new Date(this.post.publishedAt);

        // Массив названий месяцев на русском языке
        const months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];

        // Получаем день, месяц и год
        const day = date.getUTCDate(); // Получаем день
        const month = months[date.getUTCMonth()]; // Получаем месяц
        const year = date.getUTCFullYear(); // Получаем год

        // Формируем строку в нужном формате
        return `${day} ${month} ${year} г.`;
    } catch (error) {
        console.log(error);
        return 'Дата отсуствует...'
    }
}


const base_url = 'https://324cbb377ef9.vps.myjino.ru'

const apiConfic = await $fetch(`${base_url}/api/config?populate=*`)
const config = apiConfic.data

useHead({
    title: `${post.title} - ${config.title}`
})
</script>

<style scoped>

h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
  font-family: Arial, sans-serif; /* Замените на нужный шрифт */
  font-weight: bold; /* Замените на нужный вес */
  line-height: 1.5; /* Замените на нужную высоту строки */
  color: #333; /* Замените на нужный цвет заголовков */
}

h1, .h1,
h2, .h2,
h3, .h3 {
  margin-top: 1.5em; /* Замените на нужное значение */
  margin-bottom: 0.75em; /* Замените на нужное значение */
}

h4, .h4,
h5, .h5,
h6, .h6 {
  margin-top: 0.75em; /* Замените на нужное значение */
  margin-bottom: 0.75em; /* Замените на нужное значение */
}

h1, .h1 { font-size: 2em; } /* Замените на нужное значение */
h2, .h2 { font-size: 1.75em; } /* Замените на нужное значение */
h3, .h3 { font-size: 1.5em; } /* Замените на нужное значение */
h4, .h4 { font-size: 1.25em; } /* Замените на нужное значение */
h5, .h5 { font-size: 1em; } /* Замените на нужное значение */
h6, .h6 { font-size: 0.875em; } /* Замените на нужное значение */

/* Body text
------------------------- */
p {
  margin: 0 0 0.75em; /* Замените на нужное значение */
}

.lead {
  margin-bottom: 1.5em; /* Замените на нужное значение */
  font-size: 1.15em; /* Замените на нужное значение */
  font-weight: 300;
  line-height: 1.4;
}

@media (min-width: 576px) { /* Замените на нужный размер экрана */
  .lead {
    font-size: 1.5em; /* Замените на нужное значение */
  }
}

/* Emphasis & misc
------------------------- */
small,
.small {
  font-size: 0.85em; /* Замените на нужное значение */
}

/* Undo browser default styling */
cite {
  font-style: normal;
}

mark,
.mark {
  background-color: #ffeb3b; /* Замените на нужный цвет */
  padding: 0.2em;
}

/* Alignment */
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-center { text-align: center; }
.text-justify { text-align: justify; }
.text-nowrap { white-space: nowrap; }

/* Transformation */
.text-lowercase { text-transform: lowercase; }
.text-uppercase { text-transform: uppercase; }
.text-capitalize { text-transform: capitalize; }

/* Contextual colors */
.text-muted { color: #6c757d; } /* Замените на нужный цвет */
.text-primary { color: #007bff; } /* Замените на нужный цвет */
.text-success { color: #28a745; } /* Замените на нужный цвет */
.text-info { color: #17a2b8; } /* Замените на нужный цвет */
.text-warning { color: #ffc107; } /* Замените на нужный цвет */
.text-danger { color: #dc3545; } /* Замените на нужный цвет */

/* Contextual backgrounds */
.bg-primary { color: #fff; background-color: #007bff; } /* Замените на нужный цвет */
.bg-success { background-color: #28a745; } /* Замените на нужный цвет */
.bg-info { background-color: #17a2b8; } /* Замените на нужный цвет */
.bg-warning { background-color: #ffc107; } /* Замените на нужный цвет */
.bg-danger { background-color: #dc3545; } /* Замените на нужный цвет */

</style>