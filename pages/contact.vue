<template>
    <div class="bg-[url('/public/img/фонЗебра.png')] bg-right bg-no-repeat bg-[length:83%_100%] h-full">
        <div class="flex justify-center items-center h-full">
            <!-- левая страница -->
            <div ref="note_left" class="relative w-[445px] h-[598px]">
                <img src="/public/img/лист_1.png" alt="">
                <div class="absolute top-0 left-0 p-8 pr-12 w-full h-full bg-red-600/00">
                    {{ currentPages[0]?.content }}
                </div>
            </div>
            <!-- правая страница -->
            <div class="relative w-[445px] h-[598px]" :class="{ 'pageFlip': pageFlipRight }">
                <img src="/public/img/лист_2.png" alt="">
                <div class="absolute top-0 left-0 p-8 pr-12 w-full h-full bg-red-600/00">
                    {{ currentPages[1]?.content }}
                </div>
            </div>
            <button class="block bg-black text-white px-3 py-2 rounded-md" @click="fetchAndFlip">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const pageFlipRight = ref(false);
const currentPages = ref([]);
let currentPage = 1;
const pageSize = 2;

const fetchPages = async (animate = false) => {
    try {
        const response = await fetch(`https://324cbb377ef9.vps.myjino.ru/api/abouts?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        currentPages.value = data.data;


        console.log(currentPages.value[0].content);
        if (animate) {
            flip();
        }
        currentPage++;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

const flip = () => {
    pageFlipRight.value = !pageFlipRight.value;
};

const fetchAndFlip = () => {
    fetchPages(true);
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

.pageFlip {
    overflow: hidden;
    perspective: 1000px;
    animation: pageFlip 1s ease-in-out;
}
</style>