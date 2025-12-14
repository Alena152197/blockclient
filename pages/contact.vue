<template>
    <div class="bg-[url('/public/img/фонЗебра.png')] bg-right bg-no-repeat bg-[length:83%_100%] h-full">
        <div class="flex justify-center items-center h-full relative">
            <div class="absolute flex z-0 lg:flex hidden">
                <!-- левая страница -->
                <div ref="left" class="relative w-[445px] h-[598px] lg:w-[445px] lg:h-[598px] md:w-[380px] md:h-[520px] sm:w-[320px] sm:h-[440px] max-[480px]:w-[280px] max-[480px]:h-[380px]">
                    <img src="/public/img/лист_1.png" alt="" class="w-full h-full object-cover">
                </div>
                <!-- правая страница -->
                <div ref="right" class="relative w-[445px] h-[598px] lg:w-[445px] lg:h-[598px] md:w-[380px] md:h-[520px] sm:w-[320px] sm:h-[440px] max-[480px]:w-[280px] max-[480px]:h-[380px]">
                    <img src="/public/img/лист_2.png" alt="" class="w-full h-full object-cover">
                </div>
            </div>

            <!-- левая страница -->
            <div ref="left"
                :class="[
                    'relative z-[1] w-[445px] h-[598px] lg:w-[445px] lg:h-[598px] md:w-[380px] md:h-[520px] sm:w-[320px] sm:h-[440px] max-[480px]:w-[280px] max-[480px]:h-[380px]',
                    'drop-shadow-[10px_15px_25px_rgba(0,0,0,0.4)] drop-shadow-[5px_8px_15px_rgba(0,0,0,0.3)]',
                    'book-left',
                    { 'pageFlipPrew': pageFlipLeft }, 
                    leftClass
                ]">
                <img src="/public/img/лист_1.png" alt="" class="w-full h-full object-cover relative page-bg">
                <div class="book-spine absolute top-0 bottom-0 right-[-4px] w-2 bg-gradient-to-b from-[#8b7850] via-[#6b5a3a] via-[#5a4a2a] via-[#6b5a3a] to-[#8b7850] z-[10] rounded-r-sm shadow-[inset_-2px_0_8px_rgba(0,0,0,0.4),inset_2px_0_8px_rgba(0,0,0,0.4),0_0_15px_rgba(0,0,0,0.3)]"></div>
                <div class="absolute top-0 left-0 p-32 md:p-[28px_30px] sm:p-[26px_28px] max-[480px]:p-[24px_26px] w-full h-full overflow-hidden box-border z-[5] bg-[rgba(255,252,248,0.7)] book-text-content">
                    <div class="book-text font-serif text-[17px] md:text-[15px] sm:text-[14px] max-[480px]:text-[13px] leading-[1.7] md:leading-[1.65] sm:leading-[1.5] max-[480px]:leading-[1.4] text-[#1f1f1f] text-justify tracking-[0.3px] sm:tracking-[0.2px] word-spacing-[0.1em] w-full h-full max-h-full block box-border overflow-hidden break-words transition-colors duration-300" style="text-shadow: 0.3px 0.3px 0.5px rgba(255, 255, 255, 0.9), 0.1px 0.1px 0.2px rgba(0, 0, 0, 0.05);" v-html="currentPages[1]?.content ? markdown.render(currentPages[1].content) : ''"></div>
                </div>
            </div>
            
            <!-- Горизонтальные шнурки, соединяющие страницы через отверстия (21 штука) -->
            <!-- Фиксированные позиции в пикселях для стабильности (рассчитано для высоты 598px) -->
            <div class="book-thread book-thread-1 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-2 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-3 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-4 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-5 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-6 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-7 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-8 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-9 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-10 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-11 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-12 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-13 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-14 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-15 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-16 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-17 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-18 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-19 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-20 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
            <div class="book-thread book-thread-21 absolute left-1/2 transform -translate-x-1/2 w-[20px] h-[5px] z-[15] pointer-events-none"></div>
          
            
            <!-- правая страница -->
            <div ref="right" :class="[
                'relative z-[1] w-[445px] h-[598px] lg:w-[445px] lg:h-[598px] md:w-[380px] md:h-[520px] sm:w-[320px] sm:h-[440px] max-[480px]:w-[280px] max-[480px]:h-[380px]',
                'drop-shadow-[10px_15px_25px_rgba(0,0,0,0.4)] drop-shadow-[5px_8px_15px_rgba(0,0,0,0.3)]',
                'book-right',
                { 'pageFlip': pageFlipRight }
            ]">
                <img src="/public/img/лист_2.png" alt="" class="w-full h-full object-cover relative page-bg">
                <div class="book-spine absolute top-0 bottom-0 left-[-4px] w-2 bg-gradient-to-b from-[#8b7850] via-[#6b5a3a] via-[#5a4a2a] via-[#6b5a3a] to-[#8b7850] z-[10] rounded-l-sm shadow-[inset_-2px_0_8px_rgba(0,0,0,0.4),inset_2px_0_8px_rgba(0,0,0,0.4),0_0_15px_rgba(0,0,0,0.3)]"></div>
                <div class="absolute top-0 left-0 p-32 md:p-[28px_30px] sm:p-[26px_28px] max-[480px]:p-[24px_26px] w-full h-full overflow-hidden box-border z-[5] bg-[rgba(255,252,248,0.7)] book-text-content">
                    <div class="book-text font-serif text-[17px] md:text-[15px] sm:text-[14px] max-[480px]:text-[13px] leading-[1.7] md:leading-[1.65] sm:leading-[1.5] max-[480px]:leading-[1.4] text-[#1f1f1f] text-justify tracking-[0.3px] sm:tracking-[0.2px] word-spacing-[0.1em] w-full h-full max-h-full block box-border overflow-hidden break-words transition-colors duration-300" style="text-shadow: 0.3px 0.3px 0.5px rgba(255, 255, 255, 0.9), 0.1px 0.1px 0.2px rgba(0, 0, 0, 0.05);" v-html="currentPages[0]?.content ? markdown.render(currentPages[0].content) : ''"></div>
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
/* Псевдоэлементы для страниц книги - граница страницы */
[class*="book-left"]::after,
[class*="book-right"]::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(200, 180, 150, 0.3);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
}

/* Тень от корешка на страницах */
.book-left::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 20px;
    background: linear-gradient(
        to left,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.08) 30%,
        transparent 100%
    );
    pointer-events: none;
    z-index: 2;
}

.book-right::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 20px;
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.08) 30%,
        transparent 100%
    );
    pointer-events: none;
    z-index: 2;
}

/* Горизонтальные шнурки, соединяющие страницы через отверстия */
.book-thread {
    background: linear-gradient(
        to right,
        #654321 0%,
        #5a3a1f 10%,
        #4a2c15 20%,
        #3d2410 30%,
        #4a2c15 40%,
        #5a3a1f 50%,
        #4a2c15 60%,
        #3d2410 70%,
        #5a3a1f 80%,
        #654321 100%
    );
    box-shadow: 
        0 0 8px rgba(0, 0, 0, 0.8),
        0 0 4px rgba(101, 67, 33, 0.6),
        0 2px 4px rgba(0, 0, 0, 0.6),
        inset 0 1px 3px rgba(255, 255, 255, 0.15),
        inset 0 -1px 3px rgba(0, 0, 0, 0.8);
    border-radius: 2px;
    border: 1px solid rgba(101, 67, 33, 0.5);
}

/* Фиксированные позиции для шнурков (равномерно распределены по всей высоте страницы 598px, расстояние ~28px) */
.book-thread-1 { top: 115px; }
.book-thread-2 { top: 141px; }
.book-thread-3 { top: 168px; }
.book-thread-4 { top: 195px; }
.book-thread-5 { top: 222px; }
.book-thread-6 { top: 250px; }
.book-thread-7 { top: 278px; }
.book-thread-8 { top: 304px; }
.book-thread-9 { top: 332px; }
.book-thread-10 { top: 359px; }
.book-thread-11 { top: 386px; }
.book-thread-12 { top: 413px; }
.book-thread-13 { top: 440px; }
.book-thread-14 { top: 468px; }
.book-thread-15 { top: 495px; }
.book-thread-16 { top: 522px; }
.book-thread-17 { top: 550px; }
.book-thread-18 { top: 576px; }
.book-thread-19 { top: 603px; }
.book-thread-20 { top: 630px; }
.book-thread-21 { top: 657px; }

/* Адаптивные позиции для разных размеров экрана */
@media (max-width: 1024px) {
    /* Для высоты 520px (md) - равномерно распределены, расстояние ~24px */
    .book-thread-1 { top: 80px; }
    .book-thread-2 { top: 104px; }
    .book-thread-3 { top: 128px; }
    .book-thread-4 { top: 152px; }
    .book-thread-5 { top: 176px; }
    .book-thread-6 { top: 200px; }
    .book-thread-7 { top: 224px; }
    .book-thread-8 { top: 248px; }
    .book-thread-9 { top: 272px; }
    .book-thread-10 { top: 296px; }
    .book-thread-11 { top: 320px; }
    .book-thread-12 { top: 344px; }
    .book-thread-13 { top: 368px; }
    .book-thread-14 { top: 392px; }
    .book-thread-15 { top: 416px; }
    .book-thread-16 { top: 440px; }
    .book-thread-17 { top: 464px; }
    .book-thread-18 { top: 488px; }
    .book-thread-19 { top: 512px; }
    .book-thread-20 { top: 536px; }
    .book-thread-21 { top: 560px; }
}

@media (max-width: 768px) {
    /* Для высоты 440px (sm) - равномерно распределены, расстояние ~20px */
    .book-thread-1 { top: 75px; }
    .book-thread-2 { top: 95px; }
    .book-thread-3 { top: 115px; }
    .book-thread-4 { top: 135px; }
    .book-thread-5 { top: 155px; }
    .book-thread-6 { top: 175px; }
    .book-thread-7 { top: 195px; }
    .book-thread-8 { top: 215px; }
    .book-thread-9 { top: 235px; }
    .book-thread-10 { top: 255px; }
    .book-thread-11 { top: 275px; }
    .book-thread-12 { top: 295px; }
    .book-thread-13 { top: 315px; }
    .book-thread-14 { top: 335px; }
    .book-thread-15 { top: 355px; }
    .book-thread-16 { top: 375px; }
    .book-thread-17 { top: 395px; }
    .book-thread-18 { top: 415px; }
    .book-thread-19 { top: 435px; }
    .book-thread-20 { top: 455px; }
    .book-thread-21 { top: 475px; }
}

@media (max-width: 480px) {
    /* Для высоты 380px (max-[480px]) - равномерно распределены, расстояние ~17px */
    .book-thread-1 { top: 47px; }
    .book-thread-2 { top: 64px; }
    .book-thread-3 { top: 81px; }
    .book-thread-4 { top: 98px; }
    .book-thread-5 { top: 115px; }
    .book-thread-6 { top: 132px; }
    .book-thread-7 { top: 149px; }
    .book-thread-8 { top: 166px; }
    .book-thread-9 { top: 183px; }
    .book-thread-10 { top: 200px; }
    .book-thread-11 { top: 217px; }
    .book-thread-12 { top: 234px; }
    .book-thread-13 { top: 251px; }
    .book-thread-14 { top: 268px; }
    .book-thread-15 { top: 285px; }
    .book-thread-16 { top: 302px; }
    .book-thread-17 { top: 319px; }
    .book-thread-18 { top: 336px; }
    .book-thread-19 { top: 353px; }
    .book-thread-20 { top: 370px; }
    .book-thread-21 { top: 387px; }
}

/* Отверстия уже есть на изображении книги, поэтому дополнительные элементы не нужны */

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
    z-index: 20;
}

.pageFlipPrew {
    overflow: hidden;
    perspective: 1000px;
    animation: pageFlipPrew 1s ease-in-out;
    z-index: 20;
}

/* Скрываем текст во время перелистывания */
.pageFlip .book-text-content,
.pageFlipPrew .book-text-content {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
}

/* Эффект старой бумаги для текстового контента */
.book-text-content {
    background-image: 
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.003) 2px,
            rgba(0, 0, 0, 0.003) 4px
        );
}

/* Стили для абзацев - базовые стили, адаптивность через Tailwind классы */
.book-text p {
    margin: 0 0 0.7em 0;
    text-indent: 1.5em;
    position: relative;
    overflow: visible;
    word-wrap: break-word;
    hyphens: auto;
}


.book-text p:first-child {
    text-indent: 0;
    font-size: 1.05rem;
    line-height: 1.8;
}

/* Декоративная капля для первого абзаца - только псевдоэлемент */
.book-text p:first-child::first-letter {
    font-size: 3.5rem;
    line-height: 0.8;
    float: left;
    padding-right: 0.1em;
    padding-top: 0.05em;
    color: #8b7850;
    font-weight: bold;
    font-family: 'Georgia', serif;
}


/* Заголовки в книге - базовые стили, адаптивность через медиа-запросы (элементы генерируются через markdown) */
.book-text h1,
.book-text h2,
.book-text h4,
.book-text h5,
.book-text h6 {
    font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', serif;
    font-weight: 600;
    color: #2d2d2d;
    margin: 1.2em 0 0.6em 0;
    text-align: left;
    text-indent: 0;
    line-height: 1.4;
    letter-spacing: 0.5px;
    text-shadow: 0.2px 0.2px 0.3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    word-wrap: break-word;
}

.book-text h1 {
    font-size: 2.2rem;
    margin-top: 0;
    margin-bottom: 1em;
    padding-bottom: 0.4em;
    border-bottom: 3px solid rgba(139, 120, 80, 0.4);
    position: relative;
    color: #1a1a1a;
    font-weight: 700;
}

.book-text h1::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, rgba(139, 120, 80, 0.6), transparent);
}

.book-text h2 {
    font-size: 1.8rem;
    color: #252525;
    border-left: 4px solid rgba(139, 120, 80, 0.3);
    padding-left: 0.8em;
    margin-left: -0.8em;
}

/* ============================================
   ОСНОВНОЙ СТИЛЬ H3 ДЛЯ БОЛЬШИХ ЭКРАНОВ (>1024px)
   ИЗМЕНЯЙ ЗДЕСЬ ДЛЯ ДЕСКТОПА!
   ============================================ */
:deep(.book-text h3) {
    font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', serif !important;
    font-size: 1.6em !important;
    font-weight: 700 !important;
    color: #2a2a2a !important;
    font-style: italic !important;
    margin: 1px 20px 20px !important;
    padding-left: 0 !important;
    text-align: center !important;
    text-indent: 0 !important;
    line-height: 1.2 !important;
    letter-spacing: 0.5px !important;
    text-shadow: 0.2px 0.2px 0.3px rgba(0, 0, 0, 0.1) !important;
    overflow: hidden;
    word-wrap: break-word;
}

.book-text h4 {
    font-size: 1.3rem;
    color: #2d2d2d;
}

/* Адаптивность - объединенные медиа-запросы */
@media (max-width: 1024px) {
    .book-text h1 { font-size: 2rem; margin: 0.8em 0 0.6em 0; }
    .book-text h2 { font-size: 1.6rem; }
    :deep(.book-text h3) { font-size: 2.3rem !important; margin-top: 1.6em !important; }
    .book-text p:first-child::first-letter { font-size: 3rem; }
}
@media (max-width: 768px) {
    .book-text h1 { font-size: 1.8rem; margin: 0.6em 0 0.5em 0; padding-bottom: 0.3em; }
    .book-text h2 { font-size: 1.5rem; margin: 1em 0 0.5em 0; }
    :deep(.book-text h3) { font-size: 2.1rem !important; margin-top: 1.4em !important; margin-bottom: 0.6em !important; }
    .book-text h4 { font-size: 1rem; }
    .book-text p { margin-bottom: 0.7em; text-indent: 1em; }
    .book-text p:first-child::first-letter { font-size: 2.5rem; }
    .book-text ul, .book-text ol { margin: 0.7em 0; padding-left: 1.5em; }
    .book-text li { margin: 0.4em 0; line-height: 1.5; }
    .book-text blockquote { margin: 1em 1.2em; padding: 0.7em 1em; font-size: 0.9rem; }
}
@media (max-width: 480px) {
    .book-text h1 { font-size: 1.6rem; margin: 0.5em 0 0.4em 0; padding-bottom: 0.25em; }
    .book-text h2 { font-size: 1.4rem; margin: 0.8em 0 0.4em 0; }
    :deep(.book-text h3) { font-size: 1.9rem !important; margin-top: 1.2em !important; margin-bottom: 0.5em !important; }
    .book-text p { margin-bottom: 0.6em; text-indent: 0.8em; }
    .book-text p:first-child::first-letter { font-size: 2.2rem; }
    .book-text ul, .book-text ol { margin: 0.6em 0; padding-left: 1.2em; }
    .book-text blockquote { margin: 0.8em 1em; padding: 0.6em 0.9em; font-size: 0.85rem; }
}

/* Выделение текста */
.book-text strong,
.book-text b {
    font-weight: 650;
    color: #1a1a1a;
    background: linear-gradient(180deg, transparent 60%, rgba(139, 120, 80, 0.15) 60%);
    padding: 0 0.1em;
}

.book-text em,
.book-text i {
    font-style: italic;
    color: #2d2d2d;
    font-family: 'Georgia', serif;
}

/* Списки - красивые, адаптивность через Tailwind классы */
.book-text ul,
.book-text ol {
    margin: 1em 0;
    padding-left: 2em;
    text-indent: 0;
}

.book-text ul {
    list-style: none;
}

.book-text ul li::before {
    content: '▪';
    color: rgba(139, 120, 80, 0.6);
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1.5em;
    font-size: 1.2rem;
}

.book-text ol {
    counter-reset: item;
}

.book-text ol li {
    counter-increment: item;
    position: relative;
    padding-left: 0.5em;
}

.book-text ol li::before {
    content: counter(item) '.';
    color: rgba(139, 120, 80, 0.7);
    font-weight: 600;
    position: absolute;
    left: -1.5em;
}

.book-text li {
    margin: 0.5em 0;
    line-height: 1.7;
    padding-left: 0.5em;
}

/* Цитаты - элегантные, адаптивность через Tailwind классы */
.book-text blockquote {
    margin: 1.5em 2em;
    padding: 1em 1.5em;
    border-left: 4px solid rgba(139, 120, 80, 0.5);
    border-right: 1px solid rgba(139, 120, 80, 0.2);
    background: linear-gradient(
        to right,
        rgba(250, 245, 240, 0.6) 0%,
        rgba(255, 252, 248, 0.4) 100%
    );
    font-style: italic;
    text-indent: 0;
    font-size: 0.95rem;
    color: #3a3a3a;
    line-height: 1.8;
    position: relative;
    box-shadow: inset 0 0 20px rgba(139, 120, 80, 0.05);
    border-radius: 0 4px 4px 0;
}

.book-text blockquote::before {
    content: '"';
    font-size: 3rem;
    line-height: 0.1em;
    color: rgba(139, 120, 80, 0.3);
    position: absolute;
    left: 0.3em;
    top: 0.3em;
    font-family: 'Georgia', serif;
}

.book-text blockquote::after {
    content: '"';
    font-size: 3rem;
    line-height: 0.1em;
    color: rgba(139, 120, 80, 0.3);
    position: absolute;
    right: 0.3em;
    bottom: 0.1em;
    font-family: 'Georgia', serif;
}

/* Ссылки - элегантные */
.book-text a {
    color: #6b5a3a;
    text-decoration: none;
    border-bottom: 1.5px solid rgba(107, 90, 58, 0.4);
    padding-bottom: 0.1em;
    transition: all 0.3s ease;
    font-weight: 500;
}

.book-text a:hover {
    color: #8b7850;
    border-bottom-color: rgba(139, 120, 80, 0.7);
    background: linear-gradient(180deg, transparent 90%, rgba(139, 120, 80, 0.1) 90%);
}

/* Горизонтальная линия */
.book-text hr {
    border: none;
    border-top: 1px solid rgba(139, 120, 80, 0.3);
    margin: 2em 0;
}

/* Код */
.book-text code {
    background: rgba(240, 240, 240, 0.8);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
}

/* Изображения */
.book-text img {
    max-width: 100%;
    height: auto;
    margin: 1em 0;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Адаптивные стили уже применены через Tailwind классы в шаблоне */

</style>