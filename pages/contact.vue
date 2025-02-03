<template>
    <div class="bg-[url('/public/img/фонЗебра.png')] bg-right bg-no-repeat bg-[length:83%_100%] h-full">
        <div class="flex justify-center items-center h-full relative">
            <div class="absolute flex">
                <!-- левая страница -->
                <div ref="left" :class="['relative', 'wax-w-[445px]', 'max-h-[598px]']">
                    <img src="/public/img/лист_1.png" alt="" class="w-full h-full object-cover">
                </div>
                <!-- правая страница -->
                <div ref="right" :class="['relative', 'wax-w-[445px]', 'max-h-[598px]']">
                    <img src="/public/img/лист_2.png" alt="" class="w-full h-full object-cover">
                </div>
            </div>

            <!-- левая страница -->
            <div ref="left"
                :class="['relative', 'w-[445px]', 'h-[598px]', { 'pageFlipPrew': pageFlipLeft }, leftClass]">
                <img src="/public/img/лист_1.png" alt="" class="w-full h-full object-cover ">
                <div
                    class="absolute top-0 left-0 p-8 pr-12 w-full h-full bg-white-100 overflow-y-hidden text-ellipsis sm:text-sm md:text-sm lg:text-sm 2xl:text-sm flex items-center justify-center">
                    <p class="text-gray-800 leading-relaxed tracking-wide font-semibold drop-shadow-md text-center"
                        v-html="currentPages[1]?.content ? markdown.render(currentPages[1].content) : ''"></p>
                </div>
            </div>
            <!-- правая страница -->
            <div ref="right" :class="['relative', 'w-[445px]', 'h-[598px]', { 'pageFlip': pageFlipRight }]">
                <img src="/public/img/лист_2.png" alt="" class="w-full h-full object-cover">
                <div
                    class="absolute top-0 left-0 p-8 pr-12 w-full h-full bg-white-100 overflow-y-hidden text-ellipsis sm:text-sm md:text-sm lg:text-sm 2xl:text-sm flex items-center justify-center">
                    <p class="text-gray-800 leading-relaxed tracking-wide font-semibold drop-shadow-md text-center"
                    v-html="currentPages[0]?.content ? markdown.render(currentPages[0].content) : ''"></p>
                </div>
            </div>
            <div class="absolute bottom-0">
                <button class="size-12 hover:text-red-600 active:text-black"
                    :class="{ 'opacity-40': currentPage <= 1, 'cursor-not-allowed': currentPage <= 1 }"
                    @click="prevPage">
                    <!-- gr -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM6.34277 11.9996L12.2925 6.0498V10.9996H17.6565V12.9996H12.2925V17.9493L6.34277 11.9996Z">
                        </path>
                    </svg>
                </button>
                <button class="size-12 hover:text-red-600 active:text-black"
                    :class="{ 'opacity-40': currentPage > 1, 'cursor-not-allowed': currentPage > 1 }" @click="nextPage">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM17.6575 11.9996L11.7077 17.9493V12.9996H6.34375V10.9996H11.7077V6.0498L17.6575 11.9996Z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MarkdownIt from "markdown-it";

const pageFlipRight = ref(false);
const pageFlipLeft = ref(false);
const currentPages = ref([]);
let currentPage = ref(1);
const pageSize = 2;
const totalPages = ref(0);
const markdown = new MarkdownIt();
const leftClass = ref('');

const fetchPages = async (animate = false) => {
    try {
        const response = await fetch(`https://324cbb377ef9.vps.myjino.ru/api/abouts?pagination[page]=${currentPage.value}&pagination[pageSize]=${pageSize}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        currentPages.value = data.data;
        totalPages.value = Math.ceil(data.meta.pagination.total / pageSize);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

const flip = (params) => {
    if (params === 'next') {
        pageFlipRight.value = true;
        setTimeout(() => {
            pageFlipRight.value = false;
            leftClass.value = '';
        }, 1000);
    }
    if (params === 'prev') {
        pageFlipLeft.value = true;
        leftClass.value = 'z-10';
        setTimeout(() => {
            pageFlipLeft.value = false;
            leftClass.value = '';
        }, 1000);
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchPages(true); // Загрузка новых данных с анимацией
        flip('next');
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchPages(true); // Загрузка новых данных с анимацией
        flip('prev');
    }
};

onMounted(() => {
    fetchPages(false); // Загрузка контента при монтировании без анимации
});
</script>

<style scoped>
@keyframes pageFlip {
    0% {
        transform: rotateY(0);
    }

    50% {
        border-radius: 0 100px 0 0;
    }

    100% {
        transform: translateX(-100%) rotateY(-180deg);
    }
}

@keyframes pageFlipPrew {
    0% {
        transform: rotateY(0);
    }

    50% {
        border-radius: 100px 0 0 0;
    }

    100% {
        transform: translateX(100%) rotateY(180deg);
    }
}

.pageFlip {
    overflow: hidden;
    perspective: 1000px;
    animation: pageFlip 1s ease-in-out;
}

.pageFlipPrew {
    overflow: hidden;
    perspective: 1000px;
    animation: pageFlipPrew 1s ease-in-out;
}
</style>

<style>
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