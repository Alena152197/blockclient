<template>
    <header class="relative z-20 shrink-0">
        <nav class="bg-gradient-to-r from-red-600 to-red-800 border-gray-200">
            <div class="mx-auto flex max-w-screen-xl items-center gap-3 px-3 py-2 sm:px-4">
                <NuxtLink to="/" class="shrink-0">
                    <img src="/img/site-logo.png" alt="Blockclient">
                </NuxtLink>

                <!-- Десктоп-ссылки -->
                <ul class="mx-auto hidden items-center gap-6 font-bold lg:flex">
                    <li>
                        <NuxtLink
                            to="/"
                            class="block rounded px-2 py-1 text-white transition hover:text-[#a79d1c]"
                            :class="{ 'font-semibold text-[#a79d1c]': isActive('') }"
                        >
                            О БЛОГЕ
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/contact"
                            class="block rounded px-2 py-1 text-white transition hover:text-[#a79d1c]"
                            :class="{ 'font-semibold text-[#a79d1c]': isActive('contact') }"
                        >
                            ИСТОРИЯ
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/blog"
                            class="block rounded px-2 py-1 text-white transition hover:text-[#a79d1c]"
                            :class="{ 'font-semibold text-[#a79d1c]': isActive('blog') || isActive('post') || isActive('category') }"
                        >
                            ИНТЕРЕСЫ
                        </NuxtLink>
                    </li>
                </ul>

                <div class="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                    <div class="relative hidden lg:block">
                        <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg class="h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span class="sr-only">Search icon</span>
                        </div>
                        <input
                            v-model="search.searchQuery"
                            type="text"
                            id="search-navbar"
                            placeholder="Поиск статей..."
                            class="placeholder-center block w-44 rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 xl:w-56"
                            @focus="goToSearch"
                            @keydown.enter.prevent="goToSearch"
                        >
                    </div>

                    <div ref="userMenuRoot" class="relative inline-block text-left">
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
                                    <p class="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-center text-base font-extrabold tracking-tight text-transparent">
                                        {{ search.userMe.username }}
                                    </p>
                                    <p class="mt-0.5 truncate text-center text-xs text-gray-400">{{ search.userMe.email }}</p>
                                </template>
                                <template v-else>
                                    <p class="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-center text-base font-extrabold tracking-tight text-transparent">
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
                        class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 lg:hidden"
                        aria-controls="mobile-nav-drawer"
                        :aria-expanded="navOpen"
                        @click.stop="navOpen = !navOpen"
                    >
                        <span class="sr-only">Открыть меню</span>
                        <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Мобильное меню: выезд справа -->
        <Teleport to="body">
            <Transition name="nav-drawer">
                <div
                    v-if="navOpen"
                    class="nav-drawer-root fixed inset-0 z-[60] lg:hidden"
                >
                    <button
                        type="button"
                        class="nav-drawer-backdrop absolute inset-0 border-0 bg-black/45"
                        aria-label="Закрыть меню"
                        @click="navOpen = false"
                    />
                    <aside
                        id="mobile-nav-drawer"
                        class="nav-drawer-panel absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-gradient-to-b from-red-700 to-red-900 shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Меню сайта"
                        @click.stop
                    >
                        <div class="flex items-center justify-between border-b border-white/15 px-4 py-3">
                            <span class="text-sm font-bold tracking-wide text-white/90">Меню</span>
                            <button
                                type="button"
                                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/15"
                                aria-label="Закрыть"
                                @click="navOpen = false"
                            >
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </div>

                        <div class="px-4 pt-4">
                            <div class="relative">
                                <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                    <svg class="h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    v-model="search.searchQuery"
                                    type="text"
                                    id="search-navbar-mobile"
                                    placeholder="Поиск статей..."
                                    class="placeholder-center block w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    @focus="goToSearch"
                                    @keydown.enter.prevent="goToSearch"
                                >
                            </div>
                        </div>

                        <ul class="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6 font-bold">
                            <li>
                                <NuxtLink
                                    to="/"
                                    class="block rounded-xl px-4 py-3 text-white transition hover:bg-white/15"
                                    :class="{ 'bg-white/20 text-[#f0e68c]': isActive('') }"
                                    @click="navOpen = false"
                                >
                                    О БЛОГЕ
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/contact"
                                    class="block rounded-xl px-4 py-3 text-white transition hover:bg-white/15"
                                    :class="{ 'bg-white/20 text-[#f0e68c]': isActive('contact') }"
                                    @click="navOpen = false"
                                >
                                    ИСТОРИЯ
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/blog"
                                    class="block rounded-xl px-4 py-3 text-white transition hover:bg-white/15"
                                    :class="{ 'bg-white/20 text-[#f0e68c]': isActive('blog') || isActive('post') || isActive('category') }"
                                    @click="navOpen = false"
                                >
                                    ИНТЕРЕСЫ
                                </NuxtLink>
                            </li>
                        </ul>
                    </aside>
                </div>
            </Transition>
        </Teleport>
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
/** Мобильное меню — выезд справа */
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

watch(navOpen, (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
})

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
    document.body.style.overflow = ''
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

.nav-drawer-enter-active,
.nav-drawer-leave-active {
    transition: opacity 0.22s ease;
}

.nav-drawer-enter-active .nav-drawer-panel,
.nav-drawer-leave-active .nav-drawer-panel {
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-drawer-enter-from,
.nav-drawer-leave-to {
    opacity: 0;
}

.nav-drawer-enter-from .nav-drawer-panel,
.nav-drawer-leave-to .nav-drawer-panel {
    transform: translateX(100%);
}
</style>
