<template>
    <button v-if="isVisible"
        class="fixed bottom-4 right-4 rounded-full bg-gray-200 text-gray-800 p-3 transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="scrollToTop">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
    </button>
</template>

<script setup>

// Определите свойство isVisible 
const isVisible = ref(false)

// Метод для прокрутки вверх
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

// Слушатели событий для прокрутки
const handleScroll = () => {
    isVisible.value = window.scrollY > 200
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Проверка при монтировании.
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>