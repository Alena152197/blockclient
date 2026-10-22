<template>
    <div class="space-y-4 text-left">
        <p class="text-sm text-gray-600">
            Название во вкладке браузера. По умолчанию берётся из настроек сайта (Strapi). После входа сохраняется на сервере и совпадает на всех устройствах.
        </p>
        <div>
            <label for="blog-display-title-input" class="mb-1 block text-sm font-medium text-gray-700">
                Название блога
            </label>
            <input
                id="blog-display-title-input"
                v-model="inputValue"
                type="text"
                maxlength="120"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                :placeholder="defaultTitle || 'Мой блог'"
            />
        </div>
        <div class="flex flex-wrap gap-3">
            <button
                type="button"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                @click="save"
            >
                Сохранить
            </button>
            <button
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                @click="reset"
            >
                По умолчанию
            </button>
        </div>
        <p v-if="message" class="text-sm text-green-600">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSearchStore } from '~/stores/search';
import { BLOG_DISPLAY_TITLE_KEY } from '~/utils/blogDisplayTitle';
import { persistBlogSettingsToServer } from '~/utils/blogClientSettingsRemote';

const search = useSearchStore();

const inputValue = ref('');
const message = ref('');

const defaultTitle = computed(() =>
    typeof search.config?.title === 'string' ? search.config.title : ''
);

onMounted(() => {
    if (!process.client) return;
    try {
        const saved = localStorage.getItem(BLOG_DISPLAY_TITLE_KEY);
        inputValue.value = saved != null ? saved : defaultTitle.value;
    } catch {
        inputValue.value = defaultTitle.value;
    }
});

function save() {
    message.value = '';
    const t = inputValue.value.trim();
    try {
        if (!t || t === defaultTitle.value) {
            localStorage.removeItem(BLOG_DISPLAY_TITLE_KEY);
        } else {
            localStorage.setItem(BLOG_DISPLAY_TITLE_KEY, t);
        }
        window.dispatchEvent(new Event('blog-display-title-changed'));
        persistBlogSettingsToServer().catch(() => {});
        message.value = 'Сохранено.';
    } catch {
        message.value = 'Не удалось сохранить.';
    }
}

function reset() {
    message.value = '';
    try {
        localStorage.removeItem(BLOG_DISPLAY_TITLE_KEY);
        inputValue.value = defaultTitle.value;
        window.dispatchEvent(new Event('blog-display-title-changed'));
        persistBlogSettingsToServer().catch(() => {});
        message.value = 'Используется название из настроек сайта.';
    } catch {
        message.value = 'Не удалось сбросить.';
    }
}
</script>
