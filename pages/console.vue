<template>
    <main class="max-w-screen-lg mx-auto py-8 px-4">
        <h1 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            А где был ты?
        </h1>

        <!-- Форма создания статьи -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Создать новую статью</h2>
            <form @submit.prevent="createPost" class="space-y-6">
                <!-- Заголовок -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Заголовок *
                    </label>
                    <input
                        id="title"
                        type="text"
                        v-model="newPost.title"
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Введите заголовок статьи"
                    />
                </div>

                <!-- Описание -->
                <div>
                    <label for="desc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Краткое описание *
                    </label>
                    <textarea
                        id="desc"
                        v-model="newPost.desc"
                        rows="3"
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Введите краткое описание статьи"
                    ></textarea>
                </div>

                <!-- Основной текст (Markdown) -->
                <div>
                    <label for="body" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Текст статьи (Markdown) *
                    </label>
                    <textarea
                        id="body"
                        v-model="newPost.body"
                        rows="10"
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                        placeholder="Введите текст статьи в формате Markdown"
                    ></textarea>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Поддерживается Markdown форматирование
                    </p>
                </div>

                <!-- Изображение -->
                <div>
                    <label for="img" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Изображение
                    </label>
                    <input
                        id="img"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        @change="handleImageChange"
                        class="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Максимальный размер файла: 10 МБ. Поддерживаемые форматы: JPG, PNG, GIF, WebP.
                        <span v-if="imageFile"> (Выбрано: {{ (imageFile.size / 1024 / 1024).toFixed(2) }} МБ)</span>
                    </p>
                    <p v-if="imagePreview" class="mt-2">
                        <img :src="imagePreview" alt="Preview" class="max-w-xs rounded-lg" />
                    </p>
                </div>

                <!-- Категории -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Категории
                    </label>
                    <div v-if="categoriesLoading" class="text-gray-500 dark:text-gray-400">
                        Загрузка категорий...
                    </div>
                    <div v-else-if="categories.length > 0" class="space-y-2">
                        <label
                            v-for="category in categories"
                            :key="category.id"
                            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                        >
                            <input
                                type="checkbox"
                                :value="category.id"
                                v-model="newPost.categories"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span class="text-gray-700 dark:text-gray-300">{{ category.title }}</span>
                        </label>
                    </div>
                    <div v-else class="text-gray-500 dark:text-gray-400">
                        Категории не найдены
                    </div>
                </div>

                <!-- Сообщения об ошибке и успехе -->
                <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-red-600 dark:text-red-400">{{ error }}</p>
                </div>
                <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p class="text-green-600 dark:text-green-400">{{ success }}</p>
                </div>

                <!-- Кнопка отправки -->
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    <span v-if="!isSubmitting">Создать статью</span>
                    <span v-else>Создание...</span>
                </button>
            </form>
        </div>
    </main>
</template>

<script setup>
import { useSearchStore } from '~/stores/search';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

// Отключаем SSR для этой страницы, чтобы она загружалась быстрее
definePageMeta({
    ssr: false
})

const search = useSearchStore();
const router = useRouter();
const base_url = 'https://324cbb377ef9.vps.myjino.ru';

const newPost = ref({
    title: '',
    desc: '',
    body: '',
    categories: []
});

const imageFile = ref(null);
const imagePreview = ref(null);
const categories = ref([]);
const categoriesLoading = ref(true);
const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const MAX_FILE_SIZE_MB = 10; // Максимальный размер файла в МБ

// Загрузка категорий
const loadCategories = async () => {
    categoriesLoading.value = true;
    try {
        const response = await $fetch(`${base_url}/api/categories?populate=*`);
        categories.value = response.data || [];
    } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        categories.value = [];
    } finally {
        categoriesLoading.value = false;
    }
};

// Обработка выбора изображения
const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Проверка размера файла
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            error.value = `Размер файла превышает ${MAX_FILE_SIZE_MB} МБ. Пожалуйста, выберите файл поменьше.`;
            imageFile.value = null;
            imagePreview.value = null;
            return;
        }

        // Проверка типа файла
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            error.value = 'Неподдерживаемый формат файла. Пожалуйста, выберите изображение (JPG, PNG, GIF, WebP).';
            imageFile.value = null;
            imagePreview.value = null;
            return;
        }

        imageFile.value = file;
        error.value = ''; // Очищаем ошибку, если файл выбран корректно
        // Создаем превью
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imageFile.value = null;
        imagePreview.value = null;
        error.value = '';
    }
};

// Создание статьи
const createPost = async () => {
    if (!search.userMe?.id) {
        error.value = 'Необходимо войти в систему';
        return;
    }

    isSubmitting.value = true;
    error.value = '';
    success.value = '';

    try {
        // Сначала загружаем изображение, если оно есть
        let imageId = null;
        if (imageFile.value) {
            const formData = new FormData();
            formData.append('files', imageFile.value);

            const token = localStorage.getItem('jwt');
            // Используем локальный прокси для обхода CORS
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!uploadResponse.ok) {
                let errorMessage = 'Ошибка при загрузке изображения';
                
                if (uploadResponse.status === 413) {
                    errorMessage = `Размер файла слишком большой. Пожалуйста, выберите изображение размером менее ${MAX_FILE_SIZE_MB} МБ.`;
                } else {
                    try {
                        const errorData = await uploadResponse.json();
                        errorMessage = errorData.message || errorData.error?.message || errorMessage;
                    } catch (e) {
                        const errorText = await uploadResponse.text().catch(() => '');
                        if (errorText.includes('413') || errorText.includes('Request Entity Too Large')) {
                            errorMessage = `Размер файла слишком большой. Пожалуйста, выберите изображение размером менее ${MAX_FILE_SIZE_MB} МБ.`;
                        }
                    }
                }
                
                throw new Error(errorMessage);
            }

            const uploadData = await uploadResponse.json();
            // В Strapi v4 ответ может быть массивом или объектом
            if (Array.isArray(uploadData)) {
                imageId = uploadData[0]?.id || uploadData[0]?.documentId;
            } else {
                imageId = uploadData?.id || uploadData?.documentId;
            }
        }

        // Создаем пост
        const token = localStorage.getItem('jwt');
        const postData = {
            data: {
                title: newPost.value.title,
                desc: newPost.value.desc,
                body: newPost.value.body,
                publishedAt: new Date().toISOString()
            }
        };

        // Добавляем изображение, если есть
        if (imageId) {
            postData.data.img = imageId;
        }

        // Добавляем категории, если выбраны
        if (newPost.value.categories.length > 0) {
            postData.data.categories = newPost.value.categories;
        }

        // Создаем пост (автор установится автоматически через lifecycle hook в Strapi, если он настроен)
        const response = await fetch(`${base_url}/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Ошибка создания поста:', errorData);
            
            let errorMessage = errorData.error?.message || errorData.message || 'Ошибка при создании статьи';
            
            // Обработка ошибки уникальности
            if (errorMessage.includes('must be unique') || errorMessage.includes('unique') || errorMessage.includes('This attribute must be unique')) {
                const details = errorData.error?.details || {};
                let fieldName = 'заголовком';
                
                if (details.errors) {
                    const firstError = Array.isArray(details.errors) ? details.errors[0] : details.errors;
                    if (firstError?.path) {
                        const path = Array.isArray(firstError.path) ? firstError.path[0] : firstError.path;
                        if (path === 'title') fieldName = 'заголовком';
                        else if (path === 'slug') fieldName = 'URL-адресом';
                        else if (path === 'documentId') fieldName = 'ID';
                    }
                }
                
                errorMessage = `Статья с таким ${fieldName} уже существует. Пожалуйста, измените заголовок или другое уникальное поле.`;
            }
            
            throw new Error(errorMessage);
        }

        success.value = 'Статья успешно создана!';
        
        // Очищаем форму
        newPost.value = {
            title: '',
            desc: '',
            body: '',
            categories: []
        };
        imageFile.value = null;
        imagePreview.value = null;

        // Перенаправляем на страницу блога через 2 секунды
        setTimeout(() => {
            router.push('/blog');
        }, 2000);

    } catch (err) {
        console.error('Ошибка при создании статьи:', err);
        error.value = err.message || 'Не удалось создать статью';
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    // Проверяем авторизацию
    if (process.client) {
        const token = localStorage.getItem('jwt');
        if (!token) {
            router.push('/admin');
            return;
        }

        // Загружаем пользователя если еще не загружен
        if (!search.userMe?.id) {
            search.fetchUserMe();
        }

        // Загружаем категории
        loadCategories();
    }
});

useHead({
    title: 'Консоль - Блог'
})
</script>

<style scoped>
/* Дополнительные стили, если нужны */
</style>
