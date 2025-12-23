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

                <!-- Основной текст (Визуальный редактор) -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Текст статьи *
                    </label>
                    
                    <!-- Панель инструментов -->
                    <div class="border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-2">
                        <!-- Жирный, курсив, подчеркивание -->
                        <button
                            type="button"
                            @click="formatText('bold')"
                            :class="[
                                'px-3 py-1.5 border rounded transition-colors',
                                activeFormats.bold 
                                    ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700' 
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            ]"
                            title="Жирный"
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            type="button"
                            @click="formatText('italic')"
                            :class="[
                                'px-3 py-1.5 border rounded transition-colors',
                                activeFormats.italic 
                                    ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700' 
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            ]"
                            title="Курсив"
                        >
                            <em>I</em>
                        </button>
                        <button
                            type="button"
                            @click="formatText('underline')"
                            :class="[
                                'px-3 py-1.5 border rounded transition-colors',
                                activeFormats.underline 
                                    ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700' 
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            ]"
                            title="Подчеркивание"
                        >
                            <u>U</u>
                        </button>
                        
                        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        
                        <!-- Размер шрифта -->
                        <select
                            @change="formatText('fontSize', $event.target.value)"
                            class="px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                            title="Размер шрифта"
                        >
                            <option value="">Размер</option>
                            <option value="1">Очень маленький</option>
                            <option value="2">Маленький</option>
                            <option value="3">Обычный</option>
                            <option value="4">Средний</option>
                            <option value="5">Большой</option>
                            <option value="6">Очень большой</option>
                            <option value="7">Огромный</option>
                        </select>
                        
                        <!-- Цвет текста -->
                        <input
                            type="color"
                            @change="formatText('foreColor', $event.target.value)"
                            class="w-10 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                            title="Цвет текста"
                            value="#000000"
                        />
                        
                        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        
                        <!-- Вставка изображения -->
                        <button
                            type="button"
                            @click="insertImage"
                            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Вставить изображение"
                        >
                            🖼️
                        </button>
                        
                        <!-- Вставка ссылки -->
                        <button
                            type="button"
                            @click="insertLink"
                            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Вставить ссылку"
                        >
                            🔗
                        </button>
                        
                        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        
                        <!-- Выравнивание -->
                        <button
                            type="button"
                            @click="formatText('justifyLeft')"
                            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="По левому краю"
                        >
                            ⬅
                        </button>
                        <button
                            type="button"
                            @click="formatText('justifyCenter')"
                            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="По центру"
                        >
                            ⬌
                        </button>
                        <button
                            type="button"
                            @click="formatText('justifyRight')"
                            class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="По правому краю"
                        >
                            ➡
                        </button>
                        
                    </div>
                    
                    <!-- Редактор -->
                    <div
                        id="editor"
                        ref="editorRef"
                        contenteditable="true"
                        @input="updateBody"
                        @mouseup="checkActiveFormats"
                        @keyup="checkActiveFormats"
                        @focus="checkActiveFormats"
                        @click="handleEditorClick"
                        class="w-full min-h-[300px] px-4 py-3 border-x border-b border-gray-300 dark:border-gray-600 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white outline-none"
                        style="white-space: pre-wrap;"
                        data-placeholder="Введите текст статьи..."
                    ></div>
                    
                    <!-- Модальное окно настроек изображения -->
                    <div
                        v-if="showImageSettings && selectedImage"
                        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                        @click.self="closeImageSettings"
                    >
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl backdrop-blur-sm">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Настройки изображения</h3>
                            
                            <!-- Превью изображения -->
                            <div 
                                class="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                :style="{ textAlign: imageSettings.align }"
                            >
                                <img 
                                    :src="selectedImage?.src" 
                                    :style="{ 
                                        width: imageSettings.width + '%', 
                                        display: 'block', 
                                        maxWidth: '100%', 
                                        height: 'auto',
                                        margin: imageSettings.align === 'center' ? '0 auto' : imageSettings.align === 'right' ? '0 0 0 auto' : '0'
                                    }"
                                    class="rounded preview-image"
                                    alt="Превью"
                                />
                            </div>
                            
                            <!-- Размер изображения -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ширина: {{ imageSettings.width }}%
                                </label>
                                <input
                                    type="range"
                                    v-model.number="imageSettings.width"
                                    min="10"
                                    max="100"
                                    step="5"
                                    class="w-full"
                                    @input="updateImageStyle"
                                />
                                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>10%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            
                            <!-- Выравнивание -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Выравнивание
                                </label>
                                <div class="flex gap-2">
                                    <button
                                        type="button"
                                        @click="setImageAlign('left')"
                                        :class="[
                                            'flex-1 px-4 py-2 rounded-lg border transition-colors',
                                            imageSettings.align === 'left'
                                                ? 'bg-blue-500 text-white border-blue-600'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        ]"
                                    >
                                        Слева
                                    </button>
                                    <button
                                        type="button"
                                        @click="setImageAlign('center')"
                                        :class="[
                                            'flex-1 px-4 py-2 rounded-lg border transition-colors',
                                            imageSettings.align === 'center'
                                                ? 'bg-blue-500 text-white border-blue-600'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        ]"
                                    >
                                        По центру
                                    </button>
                                    <button
                                        type="button"
                                        @click="setImageAlign('right')"
                                        :class="[
                                            'flex-1 px-4 py-2 rounded-lg border transition-colors',
                                            imageSettings.align === 'right'
                                                ? 'bg-blue-500 text-white border-blue-600'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        ]"
                                    >
                                        Справа
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Кнопки -->
                            <div class="flex gap-2">
                                <button
                                    type="button"
                                    @click="deleteSelectedImage"
                                    class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Удалить
                                </button>
                                <button
                                    type="button"
                                    @click="closeImageSettings"
                                    class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Используйте кнопки выше для форматирования текста
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

                <!-- Кнопки -->
                <div class="flex gap-3">
                    <button
                        type="button"
                        @click="showPreview = true"
                        class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-semibold"
                    >
                        Предварительный просмотр
                    </button>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                        <span v-if="!isSubmitting">Создать статью</span>
                        <span v-else>Создание...</span>
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Модальное окно предварительного просмотра -->
        <div
            v-if="showPreview"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            @click.self="showPreview = false"
        >
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-8 relative">
                <!-- Кнопка закрытия -->
                <button
                    @click="showPreview = false"
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <!-- Предварительный просмотр -->
                <div class="p-8">
                    <!-- Изображение -->
                    <div v-if="imagePreview" class="mb-6">
                        <img 
                            :src="imagePreview" 
                            alt="Превью статьи"
                            class="w-full h-96 object-cover rounded-lg"
                        />
                    </div>
                    
                    <!-- Заголовок -->
                    <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        {{ newPost.title || 'Без названия' }}
                    </h1>
                    
                    <!-- Описание -->
                    <p v-if="newPost.desc" class="text-lg text-gray-800 dark:text-gray-200 mb-6">
                        {{ newPost.desc }}
                    </p>
                    
                    <!-- Дата публикации -->
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
                        Дата публикации: {{ new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    
                    <!-- Контент статьи -->
                    <div 
                        ref="previewContentRef"
                        class="prose prose-lg dark:prose-invert max-w-none"
                        v-html="newPost.body || '<p class=&quot;text-gray-500 dark:text-gray-400&quot;>Текст статьи отсутствует</p>'"
                    ></div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useSearchStore } from '~/stores/search';
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick, watch } from 'vue';

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
const editorRef = ref(null);
const activeFormats = ref({
    bold: false,
    italic: false,
    underline: false
});
const selectedImage = ref(null);
const showImageSettings = ref(false);
const imageSettings = ref({
    width: 100,
    align: 'left'
});
const showPreview = ref(false);
const previewContentRef = ref(null);

const MAX_FILE_SIZE_MB = 10; // Максимальный размер файла в МБ

// Функция для применения выравнивания изображений в предварительном просмотре
const applyPreviewImageAlignment = () => {
    nextTick(() => {
        if (!previewContentRef.value) return;
        
        previewContentRef.value.querySelectorAll('img').forEach(img => {
            const parent = img.parentElement;
            if (parent && parent.tagName === 'DIV') {
                // Получаем выравнивание из стиля контейнера
                const textAlign = parent.style.textAlign || window.getComputedStyle(parent).textAlign || '';
                
                // Применяем базовые стили к изображению
                img.style.display = 'block';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                
                // Применяем выравнивание в зависимости от text-align контейнера
                if (textAlign === 'left' || textAlign === 'start') {
                    img.style.marginLeft = '0';
                    img.style.marginRight = 'auto';
                } else if (textAlign === 'center' || textAlign === 'middle') {
                    img.style.marginLeft = 'auto';
                    img.style.marginRight = 'auto';
                } else if (textAlign === 'right' || textAlign === 'end') {
                    img.style.marginLeft = 'auto';
                    img.style.marginRight = '0';
                } else {
                    // Если выравнивание не указано, применяем стандартное (центр)
                    img.style.marginLeft = 'auto';
                    img.style.marginRight = 'auto';
                }
            }
        });
    });
};

// Отслеживаем открытие предварительного просмотра
watch(showPreview, (newVal) => {
    if (newVal) {
        // Применяем выравнивание после открытия модального окна
        applyPreviewImageAlignment();
    }
});

// Проверка активных форматов
const checkActiveFormats = () => {
    if (!editorRef.value) return;
    
    activeFormats.value = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
    };
};

// Форматирование текста в редакторе
const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.value?.focus();
    updateBody();
    // Проверяем активные форматы после применения
    setTimeout(() => {
        checkActiveFormats();
    }, 10);
};

// Обновление содержимого редактора
const updateBody = () => {
    if (editorRef.value) {
        newPost.value.body = editorRef.value.innerHTML;
        checkActiveFormats();
    }
};

// Вставка изображения
const insertImage = () => {
    // Создаем скрытый input для загрузки файла
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp,image/jpg';
    input.multiple = false; // Только одно изображение за раз
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Проверка размера
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            error.value = `Размер файла превышает ${MAX_FILE_SIZE_MB} МБ. Пожалуйста, выберите файл поменьше.`;
            setTimeout(() => { error.value = ''; }, 5000);
            return;
        }
        
        // Проверка типа файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            error.value = 'Неподдерживаемый формат файла. Пожалуйста, выберите изображение (JPG, PNG, GIF, WebP).';
            setTimeout(() => { error.value = ''; }, 5000);
            return;
        }
        
        try {
            // Показываем индикатор загрузки
            error.value = '';
            success.value = 'Загрузка изображения...';
            
            const formData = new FormData();
            formData.append('files', file);
            
            const token = localStorage.getItem('jwt');
            
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
                        // Игнорируем ошибку парсинга
                    }
                }
                throw new Error(errorMessage);
            }
            
                const uploadData = await uploadResponse.json();
                const imageData = Array.isArray(uploadData) ? uploadData[0] : uploadData;
                const imageUrl = `${base_url}${imageData.url}`;
                
                // Вставляем изображение в редактор с базовыми стилями
                // Оборачиваем в div с выравниванием по умолчанию (слева)
                const imgHTML = `<div style="text-align: left; display: block; width: 100%; margin: 10px 0; clear: both;"><img src="${imageUrl}" style="max-width: 100%; height: auto; cursor: pointer;" alt="Изображение" /></div>`;
                document.execCommand('insertHTML', false, imgHTML);
                editorRef.value?.focus();
                updateBody();
            
            success.value = 'Изображение успешно добавлено!';
            setTimeout(() => { success.value = ''; }, 3000);
        } catch (err) {
            console.error('Ошибка при загрузке изображения:', err);
            error.value = err.message || 'Не удалось загрузить изображение';
            setTimeout(() => { error.value = ''; }, 5000);
        }
    };
    
    // Открываем диалог выбора файла
    input.click();
};

// Вставка ссылки
const insertLink = () => {
    const url = prompt('Введите URL ссылки:');
    if (!url || url.trim() === '') return;
    
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        // Если есть выделенный текст, создаем ссылку из него
        document.execCommand('createLink', false, url.trim());
    } else {
        // Если нет выделенного текста, вставляем ссылку с текстом
        const linkText = prompt('Введите текст ссылки:', url);
        if (linkText) {
            document.execCommand('insertHTML', false, `<a href="${url.trim()}" target="_blank">${linkText}</a>`);
        }
    }
    editorRef.value?.focus();
    updateBody();
};

// Обработка клика в редакторе
const handleEditorClick = (e) => {
    // Открываем настройки изображения ТОЛЬКО при клике непосредственно на само изображение
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        
        const img = e.target;
        selectedImage.value = img;
        
        // Получаем текущие настройки изображения
        const width = img.style.width || img.getAttribute('width') || '100';
        const widthPercent = width.toString().replace('%', '') || '100';
        imageSettings.value.width = parseInt(widthPercent);
        
        // Определяем выравнивание из родительского контейнера
        const parent = img.parentElement;
        let textAlign = 'left';
        if (parent && parent.tagName === 'DIV') {
            // Проверяем inline стиль
            textAlign = parent.style.textAlign || window.getComputedStyle(parent).textAlign || 'left';
        }
        
        // Нормализуем значение выравнивания
        if (textAlign === 'center' || textAlign === 'middle') {
            imageSettings.value.align = 'center';
        } else if (textAlign === 'right' || textAlign === 'end') {
            imageSettings.value.align = 'right';
        } else {
            imageSettings.value.align = 'left';
        }
        
        showImageSettings.value = true;
    } else {
        // Если кликнули не на изображение, закрываем настройки
        if (showImageSettings.value) {
            closeImageSettings();
        }
    }
};

// Закрытие настроек изображения
const closeImageSettings = () => {
    showImageSettings.value = false;
    selectedImage.value = null;
};

// Установка выравнивания изображения
const setImageAlign = (align) => {
    if (!selectedImage.value) return;
    
    imageSettings.value.align = align;
    const img = selectedImage.value;
    const parent = img.parentElement;
    
    // Если изображение уже в div-контейнере, просто меняем выравнивание этого контейнера
    if (parent && parent.tagName === 'DIV' && parent.children.length === 1 && parent.children[0] === img) {
        // Просто обновляем выравнивание существующего контейнера
        parent.style.textAlign = align;
        parent.style.display = 'block';
        parent.style.width = '100%';
        parent.style.margin = '10px 0';
        parent.style.clear = 'both';
    } else {
        // Если изображение не в контейнере или контейнер содержит другие элементы,
        // создаем новый контейнер с нужным выравниванием
        const imgClone = img.cloneNode(true);
        
        // Создаем новый контейнер с нужным выравниванием
        const newContainer = document.createElement('div');
        newContainer.style.textAlign = align;
        newContainer.style.display = 'block';
        newContainer.style.width = '100%';
        newContainer.style.margin = '10px 0';
        newContainer.style.clear = 'both';
        
        // Добавляем изображение в контейнер
        newContainer.appendChild(imgClone);
        
        // Заменяем старое изображение на новый контейнер
        if (parent) {
            parent.replaceChild(newContainer, img);
        } else {
            editorRef.value?.appendChild(newContainer);
        }
        
        // Обновляем ссылку на изображение
        selectedImage.value = newContainer.querySelector('img');
    }
    
    updateBody();
};

// Обновление стиля изображения
const updateImageStyle = () => {
    if (!selectedImage.value) return;
    
    const img = selectedImage.value;
    // Сохраняем выравнивание контейнера перед изменением размера
    const parent = img.parentElement;
    const currentAlign = parent && parent.tagName === 'DIV' 
        ? (parent.style.textAlign || window.getComputedStyle(parent).textAlign || 'left')
        : 'left';
    
    img.style.width = `${imageSettings.value.width}%`;
    img.style.height = 'auto';
    img.style.maxWidth = '100%';
    
    // Восстанавливаем выравнивание контейнера, если оно было потеряно
    if (parent && parent.tagName === 'DIV' && !parent.style.textAlign) {
        parent.style.textAlign = currentAlign;
    }
    
    updateBody();
    
    // Обновляем превью в модальном окне
    nextTick(() => {
        const previewImg = document.querySelector('.preview-image');
        if (previewImg && selectedImage.value) {
            previewImg.style.width = `${imageSettings.value.width}%`;
        }
    });
};

// Удаление выбранного изображения
const deleteSelectedImage = () => {
    if (!selectedImage.value) return;
    
    selectedImage.value.remove();
    closeImageSettings();
    updateBody();
};

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
        if (editorRef.value) {
            editorRef.value.innerHTML = '';
        }
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
    if (process.client) {
        // Загружаем категории
        loadCategories();
    }
});

useHead({
    title: 'Консоль - Блог'
})
</script>

<style scoped>
/* Стили для редактора */
#editor:empty:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
}

#editor {
    line-height: 1.6;
}

#editor h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
}

#editor h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.75em 0;
}

#editor h3 {
    font-size: 1.17em;
    font-weight: bold;
    margin: 0.83em 0;
}

#editor h4 {
    font-size: 1em;
    font-weight: bold;
    margin: 1em 0;
}

#editor ul, #editor ol {
    margin: 1em 0;
    padding-left: 2em;
}

#editor li {
    margin: 0.5em 0;
}

/* Стили для контейнеров изображений с выравниванием */
#editor div[style*="text-align"] {
    display: block !important;
    width: 100% !important;
    margin: 10px 0 !important;
    clear: both;
}

#editor div[style*="text-align"] img {
    display: block;
    max-width: 100%;
    height: auto;
}

/* Выравнивание по левому краю */
#editor div[style*="text-align: left"] img,
#editor div[style*="text-align:left"] img,
#editor div[style*="text-align: left;"] img,
#editor div[style*="text-align:left;"] img {
    margin-left: 0 !important;
    margin-right: auto !important;
}

/* Выравнивание по центру */
#editor div[style*="text-align: center"] img,
#editor div[style*="text-align:center"] img,
#editor div[style*="text-align: center;"] img,
#editor div[style*="text-align:center;"] img {
    margin-left: auto !important;
    margin-right: auto !important;
}

/* Выравнивание по правому краю */
#editor div[style*="text-align: right"] img,
#editor div[style*="text-align:right"] img,
#editor div[style*="text-align: right;"] img,
#editor div[style*="text-align:right;"] img {
    margin-left: auto !important;
    margin-right: 0 !important;
}

/* Стили для предварительного просмотра */
.prose div[style*="text-align"] {
    display: block !important;
    width: 100% !important;
    margin: 10px 0 !important;
    clear: both;
}

.prose div[style*="text-align"] img {
    display: block;
    max-width: 100%;
    height: auto;
}

.prose div[style*="text-align: left"] img,
.prose div[style*="text-align:left"] img,
.prose div[style*="text-align: left;"] img,
.prose div[style*="text-align:left;"] img {
    margin-left: 0 !important;
    margin-right: auto !important;
}

.prose div[style*="text-align: center"] img,
.prose div[style*="text-align:center"] img,
.prose div[style*="text-align: center;"] img,
.prose div[style*="text-align:center;"] img {
    margin-left: auto !important;
    margin-right: auto !important;
}

.prose div[style*="text-align: right"] img,
.prose div[style*="text-align:right"] img,
.prose div[style*="text-align: right;"] img,
.prose div[style*="text-align:right;"] img {
    margin-left: auto !important;
    margin-right: 0 !important;
}
</style>
