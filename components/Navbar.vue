<template>
    <header class="relative z-20 shrink-0">
        <nav class="bg-gradient-to-r from-red-600 to-red-800 border-gray-200">
            <!-- отвечает за расположение навигации -->
            <div class="max-w-screen-xl flex flex-wrap items-center justify-evenly mx-auto p-2">
                <NuxtLink to="/">
                    <img src="/img/site-logo.png" alt="Blockclient">
                </NuxtLink>

                <div class="flex gap-8 md:order-2">
                    <div class="relative hidden md:block">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span class="sr-only">Search icon</span>
                        </div>
                        <input
                            v-model="search.searchQuery"
                            type="text"
                            id="search-navbar"
                            placeholder="Поиск статей..."
                            class="block w-full p-2 ps-10 md:ps-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 placeholder-center"
                            @focus="goToSearch"
                            @keydown.enter.prevent="goToSearch"
                        >
                    </div>

                    <!-- Меню пользователя на Vue (без Flowbite dropdown — скрипт async и ломался после смены DOM / навигации) -->
                    <div ref="userMenuRoot" class="relative ml-4 inline-block text-left">
                        <button
                            id="avatarButton"
                            type="button"
                            class="block cursor-pointer rounded-full border-2 border-white/40 bg-gray-300 p-0 shadow-sm ring-offset-2 transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            aria-label="Меню пользователя"
                            :aria-expanded="userMenuOpen"
                            aria-haspopup="true"
                            aria-controls="userDropdown"
                            @click.stop="userMenuOpen = !userMenuOpen"
                        >
                            <img
                                class="pointer-events-none h-10 w-10 rounded-full object-cover"
                                :src="search.userMe?.avatar?.url ? backendUrl + search.userMe.avatar.url : '/img/default-avatar.png'"
                                alt=""
                                width="40"
                                height="40"
                                decoding="async"
                            />
                        </button>

                        <div
                            id="userDropdown"
                            v-show="userMenuOpen"
                            class="absolute right-0 top-full z-50 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black/5"
                        >
                            <div class="px-4 py-3 text-sm text-gray-900" v-if="search.userMe?.id">
                                <div>{{ search.userMe.username }}</div>
                                <div class="font-medium truncate">{{ search.userMe.email }}</div>
                            </div>
                            <div class="px-4 py-3 text-sm text-gray-900" v-else>
                                <div>Гость</div>
                                <div class="font-medium truncate">guest@example.com</div>
                            </div>

                            <ul class="py-2 text-sm text-gray-700" aria-labelledby="avatarButton">
                                <li>
                                    <NuxtLink
                                        to="/profile"
                                        class="block px-4 py-2 hover:bg-gray-100"
                                        @click="userMenuOpen = false"
                                    >
                                        Профиль
                                    </NuxtLink>
                                </li>
                                <li v-if="showConsole">
                                    <NuxtLink
                                        to="/console"
                                        class="block px-4 py-2 hover:bg-gray-100"
                                        :class="{ 'font-semibold text-blue-700': isActive('console') }"
                                        @click="userMenuOpen = false"
                                    >
                                        Консоль
                                    </NuxtLink>
                                </li>
                                <li v-if="showSettings">
                                    <NuxtLink
                                        to="/settings"
                                        class="block px-4 py-2 hover:bg-gray-100"
                                        :class="{ 'font-semibold text-blue-700': isActive('settings') }"
                                        @click="userMenuOpen = false"
                                    >
                                        Настройки
                                    </NuxtLink>
                                </li>
                            </ul>
                            <div class="py-1">
                                <NuxtLink
                                    v-if="!search.userMe?.id"
                                    to="/admin"
                                    class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    :class="{ 'font-semibold text-blue-700': isActive('admin') }"
                                    @click="userMenuOpen = false"
                                >
                                    Войти
                                </NuxtLink>
                                <NuxtLink
                                    v-else
                                    to="/admin"
                                    class="block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    :class="{ 'font-semibold text-blue-700': isActive('admin') }"
                                    @click="onLogoutClick"
                                >
                                    Выход
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-search"
                        :aria-expanded="navOpen"
                        @click.stop="navOpen = !navOpen"
                    >
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>


                <div
                    id="navbar-search"
                    class="items-center justify-between w-full md:w-auto md:order-1"
                    :class="navOpen ? 'flex' : 'hidden lg:flex'"
                >
                    <div class="relative mt-3 md:hidden ">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            v-model="search.searchQuery"
                            type="text"
                            id="search-navbar-mobile"
                            placeholder="Поиск статей..."
                            class="block w-full p-2 ps-10 text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 placeholder-center"
                            @focus="goToSearch"
                            @keydown.enter.prevent="goToSearch"
                        >
                    </div>
                    <ul
                        class="flex flex-col p-5 mt-4 font-bold md:space-x-8  md:flex-row md:mt-0  sm:flex-row sm:justify-center sm:mt-0">
                        <li>
                            <NuxtLink to="/"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0"
                                :class="{ 'md:text-[#a79d1c] font-semibold': isActive('') }"
                                @click="navOpen = false"> О БЛОГЕ
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0"
                                :class="{ 'md:text-[#a79d1c] font-semibold': isActive('contact') }"
                                @click="navOpen = false">
                                МОЯ ИСТОРИЯ</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/blog"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0"
                                :class="{ 'md:text-[#a79d1c] font-semibold': isActive('blog') || isActive('post') || isActive('category') }"
                                @click="navOpen = false">
                                МОЯ ИНТЕРЕСЫ</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useSearchStore } from '~/stores/search'
import { canAccessBlogSettings, canManageBlogContent } from '~/utils/strapiUserRole'
import { STRAPI_BASE } from '~/utils/strapiBase'

const search = useSearchStore()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const adminAllow = computed(() => ({
    emails: runtimeConfig.public.contentAdminEmails || '',
    usernames: runtimeConfig.public.contentAdminUsernames || '',
}))
const isActive = (path) => route.path.split('/')[1] === path
const router = useRouter()

const backendUrl = STRAPI_BASE
const showConsole = computed(() => canManageBlogContent(search.userMe, adminAllow.value))
const showSettings = computed(() => canAccessBlogSettings(search.userMe, adminAllow.value))

const userMenuOpen = ref(false)
const userMenuRoot = ref(null)
/** Мобильное меню на Vue — без Flowbite (он ломал DOM и поиск при навигации) */
const navOpen = ref(false)
let searchNavLock = false

function closeUserMenuOnOutside(e) {
    if (!userMenuOpen.value) return
    const el = userMenuRoot.value
    if (el && e.target instanceof Node && !el.contains(e.target)) {
        userMenuOpen.value = false
    }
}

function onEscape(e) {
    if (e.key === 'Escape') {
        userMenuOpen.value = false
        navOpen.value = false
    }
}

watch(
    () => route.fullPath,
    () => {
        userMenuOpen.value = false
        navOpen.value = false
        searchNavLock = false
    }
)

onMounted(() => {
    document.addEventListener('click', closeUserMenuOnOutside, true)
    document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
    document.removeEventListener('click', closeUserMenuOnOutside, true)
    document.removeEventListener('keydown', onEscape)
})

async function goToSearch() {
    if (route.path === '/search' || searchNavLock) return
    searchNavLock = true
    navOpen.value = false
    try {
        await nextTick()
        await router.push({
            path: '/search',
            query: search.searchQuery ? { q: search.searchQuery } : {}
        })
    } catch {
        searchNavLock = false
    }
}

function onLogoutClick() {
    userMenuOpen.value = false
    search.logout()
}
</script>

<style scoped>
.placeholder-center::placeholder {
    text-align: center;
}
</style>
