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
                            class="block cursor-pointer rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[2px] shadow-md transition hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                            aria-label="Меню пользователя"
                            :aria-expanded="userMenuOpen"
                            aria-haspopup="true"
                            aria-controls="userDropdown"
                            @click.stop="userMenuOpen = !userMenuOpen"
                        >
                            <img
                                class="pointer-events-none h-10 w-10 rounded-full object-cover"
                                :src="navAvatarSrc"
                                alt=""
                                width="40"
                                height="40"
                                decoding="async"
                            />
                        </button>

                        <div
                            id="userDropdown"
                            v-show="userMenuOpen"
                            class="user-menu-card absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl ring-1 ring-white/10"
                        >
                            <div class="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-pink-500 opacity-20 blur-2xl mix-blend-multiply" />
                            <div class="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-500 opacity-20 blur-2xl mix-blend-multiply" />

                            <div class="relative z-10 px-5 pt-5 pb-3">
                                <div class="mb-3 flex justify-center">
                                    <div class="rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[2px]">
                                        <img
                                            class="h-14 w-14 rounded-full object-cover"
                                            :src="navAvatarSrc"
                                            alt=""
                                            width="56"
                                            height="56"
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                                <template v-if="search.userMe?.id">
                                    <p class="text-center text-base font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                                        {{ search.userMe.username }}
                                    </p>
                                    <p class="mt-0.5 truncate text-center text-xs text-gray-400">{{ search.userMe.email }}</p>
                                </template>
                                <template v-else>
                                    <p class="text-center text-base font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                                        Гость
                                    </p>
                                    <p class="mt-0.5 truncate text-center text-xs text-gray-400">guest@example.com</p>
                                </template>
                            </div>

                            <ul class="relative z-10 space-y-1 border-t border-gray-700/80 px-3 py-3 text-sm" aria-labelledby="avatarButton">
                                <li>
                                    <NuxtLink
                                        to="/profile"
                                        class="block rounded-xl px-3 py-2.5 text-gray-200 transition hover:bg-gray-800 hover:text-white"
                                        :class="{ 'bg-gray-800 font-semibold text-purple-300': isActive('profile') }"
                                        @click="userMenuOpen = false"
                                    >
                                        Профиль
                                    </NuxtLink>
                                </li>
                                <li v-if="showConsole">
                                    <NuxtLink
                                        to="/console"
                                        class="block rounded-xl px-3 py-2.5 text-gray-200 transition hover:bg-gray-800 hover:text-white"
                                        :class="{ 'bg-gray-800 font-semibold text-purple-300': isActive('console') }"
                                        @click="userMenuOpen = false"
                                    >
                                        Консоль
                                    </NuxtLink>
                                </li>
                                <li v-if="showSettings">
                                    <NuxtLink
                                        to="/settings"
                                        class="block rounded-xl px-3 py-2.5 text-gray-200 transition hover:bg-gray-800 hover:text-white"
                                        :class="{ 'bg-gray-800 font-semibold text-purple-300': isActive('settings') }"
                                        @click="userMenuOpen = false"
                                    >
                                        Настройки
                                    </NuxtLink>
                                </li>
                                <template v-if="isRegularUser">
                                    <li>
                                        <NuxtLink
                                            v-if="!isSubscribed"
                                            to="/subscribe"
                                            class="block rounded-xl px-3 py-2.5 text-gray-200 transition hover:bg-gray-800 hover:text-white"
                                            :class="{ 'bg-gray-800 font-semibold text-purple-300': isActive('subscribe') }"
                                            @click="userMenuOpen = false"
                                        >
                                            Подписаться
                                        </NuxtLink>
                                        <NuxtLink
                                            v-else
                                            to="/unsubscribe"
                                            class="block rounded-xl px-3 py-2.5 text-emerald-300/90 transition hover:bg-gray-800 hover:text-emerald-200"
                                            :class="{ 'bg-gray-800 font-semibold text-emerald-300': isActive('unsubscribe') }"
                                            @click="userMenuOpen = false"
                                        >
                                            Подписан
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink
                                            to="/support"
                                            class="block rounded-xl px-3 py-2.5 text-gray-200 transition hover:bg-gray-800 hover:text-white"
                                            :class="{ 'bg-gray-800 font-semibold text-purple-300': isActive('support') }"
                                            @click="userMenuOpen = false"
                                        >
                                            Поддержать
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink
                                            to="/suggestions"
                                            class="block rounded-xl px-3 py-2.5 text-gray-200 transition hover:bg-gray-800 hover:text-white"
                                            :class="{ 'bg-gray-800 font-semibold text-purple-300': isActive('suggestions') }"
                                            @click="userMenuOpen = false"
                                        >
                                            Предложения по улучшению
                                        </NuxtLink>
                                    </li>
                                </template>
                            </ul>

                            <div class="relative z-10 border-t border-gray-700/80 px-3 py-3">
                                <NuxtLink
                                    v-if="!search.userMe?.id"
                                    to="/admin"
                                    class="block w-full rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-3 py-2.5 text-center text-sm font-bold text-white shadow-lg transition hover:brightness-110"
                                    @click="userMenuOpen = false"
                                >
                                    Войти
                                </NuxtLink>
                                <NuxtLink
                                    v-else
                                    to="/admin"
                                    class="block w-full rounded-xl border border-gray-600 bg-gray-800 px-3 py-2.5 text-center text-sm font-semibold text-gray-200 transition hover:border-purple-500 hover:bg-gray-700 hover:text-white"
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
                                ИСТОРИЯ</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/blog"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0"
                                :class="{ 'md:text-[#a79d1c] font-semibold': isActive('blog') || isActive('post') || isActive('category') }"
                                @click="navOpen = false">
                                ИНТЕРЕСЫ</NuxtLink>
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
/** Вошёл, но не админ контента — пункты подписки / поддержки / идей */
const isRegularUser = computed(
    () => Boolean(search.userMe?.id) && !showConsole.value && !showSettings.value
)

const navAvatarSrc = computed(() => {
    const url = search.userMe?.avatar?.url
    if (!url) return '/img/default-avatar.png'
    if (String(url).startsWith('http')) return url
    return `${backendUrl}${url}`
})

const isSubscribed = ref(false)

async function refreshSubscribeStatus() {
    if (!search.userMe?.email) {
        isSubscribed.value = false
        return
    }
    try {
        const token = localStorage.getItem('jwt')
        const res = await $fetch('/api/subscribe/status', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            query: { email: search.userMe.email }
        })
        isSubscribed.value = Boolean(res?.subscribed)
    } catch {
        isSubscribed.value = false
    }
}

function onSubscribeChanged(e) {
    if (e?.detail?.subscribed != null) {
        isSubscribed.value = Boolean(e.detail.subscribed)
    } else {
        refreshSubscribeStatus()
    }
}

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
    window.addEventListener('blog-subscribe-changed', onSubscribeChanged)
    refreshSubscribeStatus()
})

onUnmounted(() => {
    document.removeEventListener('click', closeUserMenuOnOutside, true)
    document.removeEventListener('keydown', onEscape)
    window.removeEventListener('blog-subscribe-changed', onSubscribeChanged)
})

watch(
    () => search.userMe?.email,
    () => {
        refreshSubscribeStatus()
    }
)

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
