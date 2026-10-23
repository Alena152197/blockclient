<template>
    <main class="flex w-full flex-col items-center px-4 py-10 text-gray-900">
        <div class="w-full max-w-5xl">
            <h1 class="mb-2 text-center text-3xl font-bold">Настройки</h1>
            <p class="mx-auto mb-8 max-w-xl text-center text-sm text-gray-600">
                Раздел доступен только администратору контента (роль в Strapi). После входа фоны и название блога сохраняются на сервере и отображаются у всех посетителей и на ваших устройствах. Без входа настройки доступны только локально в этом браузере.
            </p>

            <div class="mb-8 mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                <NuxtLink
                    to="/settings/views"
                    :prefetch="false"
                    class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-base font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Активность посетителей
                </NuxtLink>
                <NuxtLink
                    to="/settings/suggestions"
                    :prefetch="false"
                    class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-base font-semibold text-violet-950 shadow-sm transition hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Обращения
                </NuxtLink>
                <NuxtLink
                    to="/settings/unsubscribes"
                    :prefetch="false"
                    class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-base font-semibold text-rose-950 shadow-sm transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                    Отписки
                </NuxtLink>
            </div>

            <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <button
                    type="button"
                    class="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    :aria-expanded="showBgPanel"
                    aria-controls="blog-bg-settings-panel"
                    id="blog-bg-settings-trigger"
                    @click="showBgPanel = !showBgPanel"
                >
                    <span>Фон страницы «О блоге»</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': showBgPanel }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                <div
                    v-show="showBgPanel"
                    id="blog-bg-settings-panel"
                    role="region"
                    aria-labelledby="blog-bg-settings-trigger"
                    class="mt-6 border-t border-gray-100 pt-6"
                >
                    <BlogIndexBackgroundForm />
                </div>

                <button
                    type="button"
                    class="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    :aria-expanded="showContactBgPanel"
                    aria-controls="contact-bg-settings-panel"
                    id="contact-bg-settings-trigger"
                    @click="showContactBgPanel = !showContactBgPanel"
                >
                    <span>Фон страницы «Моя история»</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': showContactBgPanel }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                <div
                    v-show="showContactBgPanel"
                    id="contact-bg-settings-panel"
                    role="region"
                    aria-labelledby="contact-bg-settings-trigger"
                    class="mt-6 border-t border-gray-100 pt-6"
                >
                    <BlogIndexBackgroundForm page-id="contact" />
                </div>

                <button
                    type="button"
                    class="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    :aria-expanded="showInterestsBgPanel"
                    aria-controls="interests-bg-settings-panel"
                    id="interests-bg-settings-trigger"
                    @click="showInterestsBgPanel = !showInterestsBgPanel"
                >
                    <span>Фон страницы «Мои интересы»</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': showInterestsBgPanel }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                <div
                    v-show="showInterestsBgPanel"
                    id="interests-bg-settings-panel"
                    role="region"
                    aria-labelledby="interests-bg-settings-trigger"
                    class="mt-6 border-t border-gray-100 pt-6"
                >
                    <BlogIndexBackgroundForm page-id="interests" />
                </div>

                <button
                    type="button"
                    class="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    :aria-expanded="showNamePanel"
                    aria-controls="blog-name-settings-panel"
                    id="blog-name-settings-trigger"
                    @click="showNamePanel = !showNamePanel"
                >
                    <span>Название Блога</span>
                    <svg
                        class="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': showNamePanel }"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                <div
                    v-show="showNamePanel"
                    id="blog-name-settings-panel"
                    role="region"
                    aria-labelledby="blog-name-settings-trigger"
                    class="mt-6 border-t border-gray-100 pt-6"
                >
                    <BlogNameSettingsForm />
                </div>
            </section>

            <p class="mt-8 text-center">
                <NuxtLink to="/" class="text-blue-600 hover:underline">← На главную</NuxtLink>
            </p>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';

const showBgPanel = ref(false);
const showContactBgPanel = ref(false);
const showInterestsBgPanel = ref(false);
const showNamePanel = ref(false);

definePageMeta({
    ssr: false
});

useHead({
    title: 'Настройки'
});
</script>
