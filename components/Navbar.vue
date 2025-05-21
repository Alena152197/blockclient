<template>
    <header class="z-20 relative">
        <nav class="bg-gradient-to-r from-red-600 to-red-800 border-gray-200 dark:bg-gray-900">
            <!-- отвечает за расположение навигации -->
            <div class="max-w-screen-xl flex flex-wrap items-center justify-evenly mx-auto p-2">
                <NuxtLink to="/">
                    <img src="../public/img/логотип сайта.png" alt="">
                </NuxtLink>

                <div class="flex gap-8 md:order-2">
                    <DarkMode />
                    <div class="relative hidden md:block">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span class="sr-only">Search icon</span>
                        </div>
                        <input v-model="search.searchQuery" @focus="goToSearch" type="text" id="search-navbar"
                            class="block w-full p-2 ps-10 md:ps-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Поиск...">
                    </div>

                    <!-- Обёртка для аватара и выпадающего меню -->
                    <div class="relative inline-block text-left ml-4">
                        <!-- Аватарка -->
                        <img id="avatarButton" type="button" data-dropdown-toggle="userDropdown"
                            data-dropdown-placement="bottom-start"
                            class="w-10 h-10 rounded-full border-2 bg-gray-300 cursor-pointer"
                            :src="search.userMe?.avatar?.url ? backendUrl + search.userMe.avatar.url : '/img/default-avatar.png'"
                            alt="User avatar" />


                        <!-- Выпадающее меню (absolute) -->
                        <div id="userDropdown"
                            class="z-10 absolute right-0 top-full mt-2 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <div class="px-4 py-3 text-sm text-gray-900 dark:text-white" v-if="search.userMe?.id">
                                <div>{{ search.userMe.username }}</div>
                                <div class="font-medium truncate">{{ search.userMe.email }}</div>
                            </div>
                            <div class="px-4 py-3 text-sm text-gray-900 dark:text-white" v-else>
                                <div>Гость</div>
                                <div class="font-medium truncate">guest@example.com</div>
                            </div>

                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                                <li>
                                    <NuxtLink to="/profile"
                                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                        Профиль
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink to="/console"
                                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        :class="{ 'md:text-gray-700': isActive('console'), 'dark:text-blue-700': isActive('console') }">
                                        Консоль
                                    </NuxtLink>
                                </li>
                                <li>
                                    <a href="#"
                                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                                </li>
                            </ul>
                            <div class="py-1">
                                <NuxtLink v-if="!search.userMe?.id" to="/admin"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    :class="{ 'md:text-gray-700': isActive('admin'), 'dark:text-blue-700': isActive('admin') }">
                                    Войти
                                </NuxtLink>
                                <NuxtLink v-else to="/admin" @click="search.logout()"
                                    class="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    :class="{ 'md:text-gray-700': isActive('admin'), 'dark:text-blue-700': isActive('admin') }">
                                    Выход
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <button data-collapse-toggle="navbar-search" type="button"
                        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-search" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>


                <div class="items-center justify-between hidden w-full lg:flex md:w-auto md:order-1" id="navbar-search">
                    <div class="relative mt-3 md:hidden ">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input v-model="search.searchQuery" @focus="goToSearch" type="text" id="search-navbar"
                            class="block w-full p-2 ps-10 text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Поиск...">
                    </div>
                    <ul
                        class="flex flex-col p-5 mt-4 font-bold md:space-x-8  md:flex-row md:mt-0  sm:flex-row sm:justify-center sm:mt-0 dark:border-gray-700">
                        <li>
                            <NuxtLink to="/"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                :class="{ 'md:text-white': isActive(''), 'dark:text-blue-700': isActive('') }"> О БЛОГЕ
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                :class="{ 'md:text-white': isActive('contact'), 'dark:text-blue-700': isActive('contact') }">
                                МОЯ ИСТОРИЯ</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/blog"
                                class="block py-2 px-5 text-white rounded hover:bg-gray-100 sm:text-sm md:hover:bg-transparent md:hover:text-[#a79d1c] md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                :class="{ 'md:text-white': isActive('blog') || isActive('post') || isActive('category'), 'dark:text-blue-700': isActive('blog') || isActive('post') || isActive('category') }">
                                МОЯ ИНТЕРЕСЫ</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>

import { useSearchStore } from '~/stores/search'
const search = useSearchStore();
const route = useRoute();
const isActive = (path) => route.path.split('/')[1] === path
const router = useRouter()

console.log("userMe:", search.userMe);


const backendUrl = 'https://324cbb377ef9.vps.myjino.ru'

const avatarUrl = computed(() => {
    return search.userMe?.avatar?.url
        ? `${backendUrl}${search.userMe.avatar.url}`
        : '/img/default-avatar.png'
})


function goToSearch() {
    router.push({ path: '/search' });
};
useHead({
    script: [
        {
            src: 'https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js',
            async: true,
            defer: 'anonymous'
        }
    ]
});
</script>
