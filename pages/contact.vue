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
                    class="absolute top-0 left-0 p-8 pr-12 w-full h-full bg-white-100 overflow-y-auto text-ellipsis sm:text-sm md:text-sm lg:text-sm 2xl:text-sm flex items-center justify-center">
                    <p
                        class="text-gray-800 leading-relaxed tracking-wide font-semibold drop-shadow-md text-center ">
                        {{ currentPages[1]?.content }}
                    </p>
                </div>
            </div>
            <!-- правая страница -->
            <div ref="right" :class="['relative', 'w-[445px]', 'h-[598px]', { 'pageFlip': pageFlipRight }]">
                <img src="/public/img/лист_2.png" alt="" class="w-full h-full object-cover">
                <div
                    class="absolute top-0 left-0 p-8 pr-12 w-full h-full bg-white-100 overflow-y-auto text-ellipsis sm:text-sm md:text-sm lg:text-sm 2xl:text-sm flex items-center justify-center">
                    <p class="text-gray-800 leading-relaxed tracking-wide font-semibold drop-shadow-md text-center">
                        {{ currentPages[0]?.content }}
                    </p>
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

const pageFlipRight = ref(false);
const pageFlipLeft = ref(false);
const currentPages = ref([]);
let currentPage = 1;
const pageSize = 2;
const totalPages = ref(0);

const opacityFlipLeft = ref(true)

const fetchPages = async (animate = false) => {
    try {
        const response = await fetch(`https://324cbb377ef9.vps.myjino.ru/api/abouts?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`);
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

const leftClass = ref('');

const flip = (params) => {
    if (params === 'next') {
        pageFlipRight.value = !pageFlipRight.value;
        setTimeout(() => {
            pageFlipRight.value = false;
            leftClass.value = '';
        }, 1000);
    }
    if (params === 'prew') {
        pageFlipLeft.value = !pageFlipLeft.value;
        leftClass.value = 'z-10';
        setTimeout(() => {
            pageFlipLeft.value = false;
            leftClass.value = '';
        }, 1000);
    }
};

const nextPage = () => {
    if (currentPage < totalPages.value) {
        currentPage++;
        fetchPages(true); // Загрузка новых данных с анимацией
        flip('next');
    }
};

const prevPage = () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPages(true); // Загрузка новых данных с анимацией
        flip('prew');
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