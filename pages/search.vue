<template>
    <main class="min-h-screen p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Заголовок и поисковая строка -->
            <div class="mb-8">
                <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Поиск</h1>
                <div class="relative max-w-2xl">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        v-model="search.searchQuery" 
                        type="text" 
                        placeholder="Введите запрос для поиска..."
                        class="block w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        @input="handleSearch"
                    />
                    <button 
                        v-if="search.searchQuery" 
                        @click="clearSearch"
                        class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p v-if="!isLoading" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="search.searchQuery">
                        Найдено результатов: <span class="font-semibold">{{ posts.length }}</span>
                    </span>
                    <span v-else>
                        Всего статей: <span class="font-semibold">{{ posts.length }}</span>
                    </span>
                </p>
            </div>

            <!-- Индикатор загрузки -->
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="relative">
                    <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </div>

            <!-- Результаты поиска -->
            <div v-else-if="posts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                <article 
                    v-for="post in posts" 
                    :key="post.id" 
                    class="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700 group"
                >
                    <NuxtLink class="block overflow-hidden" :to="'/post/' + post.documentId">
                        <img 
                            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                            :src="home + post.img.url" 
                            :alt="post.title"
                        />
                    </NuxtLink>
                    <div class="p-5">
                        <NuxtLink :to="'/post/' + post.documentId">
                            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                <span v-html="highlightText(post.title, search.searchQuery)"></span>
                            </h5>
                        </NuxtLink>
                        <p class="mb-4 font-normal text-gray-700 dark:text-gray-400 line-clamp-3 text-sm">
                            <span v-html="highlightText(post.desc, search.searchQuery)"></span>
                        </p>
                        <NuxtLink 
                            :to="'/post/' + post.documentId" 
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
                        >
                            Подробнее
                            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </NuxtLink>
                    </div>
                </article>
            </div>

            <!-- Пустое состояние -->
            <div v-else-if="search.searchQuery && !isLoading" class="text-center py-20">
                <svg class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Ничего не найдено</h3>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                    По запросу <span class="font-semibold">"{{ search.searchQuery }}"</span> ничего не найдено.
                </p>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    Попробуйте изменить запрос или использовать другие ключевые слова.
                </p>
            </div>

            <!-- Начальное состояние -->
            <div v-else class="text-center py-20">
                <svg class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Начните поиск</h3>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                    Введите запрос в поисковую строку, чтобы найти интересующие вас статьи.
                </p>
            </div>
        </div>
    </main>
</template>

<script setup>
const search = useSearchStore()
const route = useRoute()
const router = useRouter()
const posts = ref([])
const isLoading = ref(false)
const home = "https://324cbb377ef9.vps.myjino.ru"

// Таймер для debounce
let searchTimeout = null

// Функция подсветки найденного текста
const highlightText = (text, query) => {
    if (!text || !query) return text
    // Экранируем специальные символы для regex
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

// Функция загрузки всех постов
const loadAllPosts = async () => {
    isLoading.value = true
    try {
        // Загружаем все посты
        const response = await $fetch(`${home}/api/posts?populate=*&sort=createdAt:desc`)
        posts.value = response.data || []
    } catch (error) {
        console.error('Ошибка при загрузке всех постов:', error)
        posts.value = []
    } finally {
        isLoading.value = false
    }
}

// Функция поиска - используем только API Strapi, без дополнительной фильтрации
const performSearch = async (query) => {
    // Если запрос пустой, загружаем все посты текущего пользователя
    if (!query || query.trim().length < 1) {
        await loadAllPosts()
        return
    }

    isLoading.value = true
    try {
        const trimmedQuery = query.trim()
        const normalizedQuery = trimmedQuery.toLowerCase()
        
        // Разбиваем запрос на отдельные слова
        const searchWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0)
        
        // Собираем все уникальные результаты
        const allResults = new Map()
        
        // Стратегия 1: Поиск по полному запросу (всегда выполняем)
        try {
            const fullQuery = encodeURIComponent(normalizedQuery)
            const fullUrl = `${home}/api/posts?populate=*&filters[$or][0][title][$containsi]=${fullQuery}&filters[$or][1][body][$containsi]=${fullQuery}&filters[$or][2][desc][$containsi]=${fullQuery}`
            const fullResponse = await $fetch(fullUrl)
            
            if (fullResponse.data && fullResponse.data.length > 0) {
                fullResponse.data.forEach(post => {
                    if (!allResults.has(post.id)) {
                        allResults.set(post.id, post)
                    }
                })
            }
        } catch (fullErr) {
            console.error('Ошибка при поиске по полному запросу:', fullErr)
        }
        
        // Стратегия 2: Если запрос состоит из нескольких слов, ищем по каждому слову отдельно
        // Это помогает найти больше результатов
        for (const word of searchWords) {
            if (word.length < 1) continue
            
            try {
                const encodedWord = encodeURIComponent(word)
                const wordUrl = `${home}/api/posts?populate=*&filters[$or][0][title][$containsi]=${encodedWord}&filters[$or][1][body][$containsi]=${encodedWord}&filters[$or][2][desc][$containsi]=${encodedWord}`
                const wordResponse = await $fetch(wordUrl)
                
                if (wordResponse.data && wordResponse.data.length > 0) {
                    wordResponse.data.forEach(post => {
                        if (!allResults.has(post.id)) {
                            allResults.set(post.id, post)
                        }
                    })
                }
            } catch (wordErr) {
                console.error(`Ошибка при поиске по слову "${word}":`, wordErr)
            }
        }
        
        // Преобразуем Map в массив
        let results = Array.from(allResults.values())
        
        // Стратегия 3: Если ничего не найдено и запрос длиннее 3 символов, 
        // пробуем поискать по первым символам и фильтруем на клиенте
        if (results.length === 0 && normalizedQuery.length > 3) {
            try {
                // Берем первые 3 символа для поиска
                const prefix = normalizedQuery.substring(0, 3)
                const encodedPrefix = encodeURIComponent(prefix)
                const prefixUrl = `${home}/api/posts?populate=*&filters[$or][0][title][$containsi]=${encodedPrefix}&filters[$or][1][body][$containsi]=${encodedPrefix}&filters[$or][2][desc][$containsi]=${encodedPrefix}`
                const prefixResponse = await $fetch(prefixUrl)
                
                if (prefixResponse.data && prefixResponse.data.length > 0) {
                    // Фильтруем результаты на клиенте - оставляем только те, где есть полный запрос
                    const filtered = prefixResponse.data.filter(post => {
                        const title = (post.title || '').toLowerCase()
                        const desc = (post.desc || '').toLowerCase()
                        const body = (post.body || '').toLowerCase()
                        const allText = `${title} ${desc} ${body}`
                        return allText.includes(normalizedQuery)
                    })
                    
                    filtered.forEach(post => {
                        if (!allResults.has(post.id)) {
                            allResults.set(post.id, post)
                        }
                    })
                }
            } catch (prefixErr) {
                console.error('Ошибка при поиске по префиксу:', prefixErr)
            }
        }
        
        // Преобразуем Map в массив еще раз (на случай если добавились результаты)
        results = Array.from(allResults.values())
        
        // Дополнительная фильтрация на клиенте: оставляем только посты, где есть хотя бы часть запроса
        results = results.filter(post => {
            const title = (post.title || '').toLowerCase()
            const desc = (post.desc || '').toLowerCase()
            const body = (post.body || '').toLowerCase()
            const allText = `${title} ${desc} ${body}`
            
            // Проверяем, есть ли хотя бы одно слово из запроса в посте
            return searchWords.some(word => allText.includes(word))
        })
        
        // Сортируем результаты: сначала те, где больше совпадений в заголовке
        results.sort((a, b) => {
            const aTitle = (a.title || '').toLowerCase()
            const bTitle = (b.title || '').toLowerCase()
            const aDesc = (a.desc || '').toLowerCase()
            const bDesc = (b.desc || '').toLowerCase()
            
            // Подсчитываем количество совпадений в заголовке и описании
            let aScore = 0
            let bScore = 0
            
            searchWords.forEach(word => {
                if (aTitle.includes(word)) aScore += 3
                if (aDesc.includes(word)) aScore += 2
                if (bTitle.includes(word)) bScore += 3
                if (bDesc.includes(word)) bScore += 2
            })
            
            return bScore - aScore
        })
        
        posts.value = results
        
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error)
        posts.value = []
    } finally {
        isLoading.value = false
    }
}

// Обработчик ввода с debounce
const handleSearch = () => {
    // Очищаем предыдущий таймер
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    // Обновляем URL сразу
    if (search.searchQuery) {
        router.replace({ query: { q: search.searchQuery } })
    } else {
        router.replace({ query: {} })
    }

    // Устанавливаем новый таймер для поиска (задержка 500ms)
    searchTimeout = setTimeout(() => {
        performSearch(search.searchQuery)
    }, 500)
}

// Очистка поиска
const clearSearch = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    search.searchQuery = ''
    router.replace({ query: {} })
    // Загружаем все посты при очистке поиска
    loadAllPosts()
}

// Загрузка запроса из URL при монтировании
onMounted(() => {
    const queryParam = route.query.q
    if (queryParam && typeof queryParam === 'string') {
        search.searchQuery = queryParam
        performSearch(queryParam)
    } else {
        // Если нет запроса в URL, загружаем все посты
        loadAllPosts()
    }
})

// Отслеживание изменений поискового запроса
watch(() => search.searchQuery, (newQuery) => {
    if (route.path === '/search') {
        handleSearch()
    }
})

// Очистка таймера при размонтировании
onUnmounted(() => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
