<template>
    <main class="max-w-2xl mx-auto py-6 px-4 text-gray-900">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-6">
            {{ isEditMode ? 'Редактирование статьи' : 'Добавление нового поста' }}
        </h1>

        <div v-if="loadingPost" class="flex flex-col items-center justify-center py-24 gap-4">
            <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="text-gray-600 text-sm">Загрузка статьи…</p>
        </div>

        <div v-else-if="isEditMode && postLoadError" class="text-center py-16 px-4">
            <p class="text-red-600 mb-6">{{ postLoadError }}</p>
            <NuxtLink to="/blog" class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                К списку статей
            </NuxtLink>
        </div>

        <!-- Форма создания / редактирования статьи -->
        <div v-else class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ isEditMode ? 'Изменить статью' : 'Создать новую статью' }}</h2>
            <form @submit.prevent="savePost" class="space-y-5">
                <!-- Изображение -->
                <div>
                    <label for="img" class="block text-sm font-medium text-gray-700 mb-2">
                        Изображение
                    </label>
                    <input
                        id="img"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        @change="handleImageChange"
                        class="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p class="mt-1 text-xs text-gray-500">
                        Максимальный размер файла: 10 МБ. Поддерживаемые форматы: JPG, PNG, GIF, WebP.
                        <span v-if="isEditMode && !imageFile" class="block mt-1 text-gray-600">Не выбирайте файл — останется текущая обложка.</span>
                        <span v-if="imageFile"> (Выбрано: {{ (imageFile.size / 1024 / 1024).toFixed(2) }} МБ)</span>
                    </p>
                    <div v-if="imagePreview" class="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 class="text-sm font-semibold text-gray-800">Обложка на странице статьи</h3>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="opt in coverAlignOptions"
                                :key="opt.v"
                                type="button"
                                class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
                                :class="
                                    coverLayout.align === opt.v
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                                "
                                @click="coverLayout.align = opt.v"
                            >
                                {{ opt.label }}
                            </button>
                        </div>
                        <div>
                            <label class="mb-1 block text-sm text-gray-700">
                                Ширина блока: {{ coverLayout.widthPercent }}%
                            </label>
                            <input
                                v-model.number="coverLayout.widthPercent"
                                type="range"
                                min="30"
                                max="100"
                                step="5"
                                class="w-full accent-blue-600"
                            />
                        </div>
                        <div>
                            <label class="mb-1 block text-sm text-gray-700">
                                Высота области: {{ coverLayout.maxHeightVh }}vh
                            </label>
                            <input
                                v-model.number="coverLayout.maxHeightVh"
                                type="range"
                                min="20"
                                max="70"
                                step="2"
                                class="w-full accent-blue-600"
                            />
                        </div>
                        <div>
                            <label for="cover-fit" class="mb-1 block text-sm text-gray-700">Как вписать фото</label>
                            <select
                                id="cover-fit"
                                v-model="coverLayout.objectFit"
                                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                            >
                                <option value="cover">Заполнить область (обрезка лишнего)</option>
                                <option value="contain">Вписать целиком (с полями)</option>
                            </select>
                        </div>
                        <p class="text-xs text-gray-500">
                            Настройки хранятся вместе с кратким описанием и отображаются на странице поста.
                        </p>
                        <div :style="coverPreviewStyles.figureStyle" class="w-full">
                            <div :style="coverPreviewStyles.innerWrapStyle">
                                <div
                                    class="group relative rounded-2xl bg-gray-200 shadow-[0_22px_50px_-14px_rgba(15,23,42,0.22)] ring-1 ring-gray-900/8"
                                    :style="coverPreviewStyles.boxStyle"
                                >
                                    <img
                                        :src="imagePreview"
                                        alt="Предпросмотр обложки"
                                        class="absolute inset-0 h-full w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
                                        :class="coverPreviewStyles.imgClass"
                                        :style="coverPreviewStyles.imgStyle"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Заголовок -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                        Заголовок *
                    </label>
                    <input
                        id="title"
                        type="text"
                        v-model="newPost.title"
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        placeholder="Введите заголовок статьи"
                    />
                </div>

                <!-- Основной текст (Визуальный редактор) -->
                <div>
                    <!-- Подпись + панель инструментов: sticky — при прокрутке длинного текста всегда видны -->
                    <div
                        class="sticky top-0 z-30 rounded-t-lg border border-gray-300 border-b-0 bg-gray-100 shadow-sm ring-1 ring-black/5"
                    >
                    <label class="block px-3 pt-2.5 pb-1 text-sm font-medium text-gray-700">
                        Текст статьи *
                    </label>
                    <div class="flex flex-wrap gap-2 border-t border-gray-200/90 p-2">
                        <!-- Жирный, курсив, подчеркивание -->
                        <button
                            type="button"
                            @click="formatText('bold')"
                            :class="[
                                'px-3 py-1.5 border rounded transition-colors text-gray-900',
                                activeFormats.bold 
                                    ? 'bg-blue-500 text-white border-blue-600' 
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            ]"
                            title="Жирный"
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            type="button"
                            @click="formatText('italic')"
                            :class="[
                                'px-3 py-1.5 border rounded transition-colors text-gray-900',
                                activeFormats.italic 
                                    ? 'bg-blue-500 text-white border-blue-600' 
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            ]"
                            title="Курсив"
                        >
                            <em>I</em>
                        </button>
                        <button
                            type="button"
                            @click="formatText('underline')"
                            :class="[
                                'px-3 py-1.5 border rounded transition-colors text-gray-900',
                                activeFormats.underline 
                                    ? 'bg-blue-500 text-white border-blue-600' 
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            ]"
                            title="Подчеркивание"
                        >
                            <u>U</u>
                        </button>
                        
                        <div class="w-px bg-gray-300 mx-1"></div>
                        
                        <!-- Размер шрифта -->
                        <select
                            @change="formatText('fontSize', $event.target.value)"
                            class="px-2 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-900"
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
                            class="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                            title="Цвет текста"
                            value="#ffffff"
                        />

                        <label
                            class="flex items-center gap-1.5 text-xs text-gray-800 shrink-0"
                            title="Цвет фона области, в которой набирается текст (только в редакторе)"
                        >
                            <span class="hidden sm:inline whitespace-nowrap">Фон поля</span>
                            <input
                                v-model="editorSurfaceBg"
                                type="color"
                                class="h-8 w-10 cursor-pointer rounded border border-gray-300"
                            />
                        </label>
                        
                        <div class="w-px bg-gray-300 mx-1"></div>
                        
                        <!-- Вставка изображения -->
                        <button
                            type="button"
                            @click="insertImage"
                            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-900"
                            title="Вставить изображение"
                        >
                            🖼️
                        </button>
                        
                        <!-- Вставка ссылки -->
                        <button
                            type="button"
                            @click="insertLink"
                            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-900"
                            title="Вставить ссылку"
                        >
                            🔗
                        </button>
                        
                        <div class="w-px bg-gray-300 mx-1"></div>
                        
                        <!-- Выравнивание -->
                        <button
                            type="button"
                            @click="formatText('justifyLeft')"
                            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-900"
                            title="По левому краю"
                        >
                            ⬅
                        </button>
                        <button
                            type="button"
                            @click="formatText('justifyCenter')"
                            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-900"
                            title="По центру"
                        >
                            ⬌
                        </button>
                        <button
                            type="button"
                            @click="formatText('justifyRight')"
                            class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-900"
                            title="По правому краю"
                        >
                            ➡
                        </button>
                        
                    </div>
                    </div>
                    
                    <!-- Редактор -->
                    <div
                        id="editor"
                        ref="editorRef"
                        contenteditable="true"
                        spellcheck="true"
                        @input="updateBody"
                        @mouseup="checkActiveFormats"
                        @keyup="checkActiveFormats"
                        @focus="checkActiveFormats"
                        @click="handleEditorClick"
                        class="editor-surface w-full min-h-[240px] border-x border-b border-t border-gray-600 px-3 py-2.5 rounded-b-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        :style="editorSurfaceStyle"
                        data-placeholder="Введите текст статьи..."
                    ></div>
                    
                    <!-- Модальное окно настроек изображения -->
                    <div
                        v-if="showImageSettings && selectedImage"
                        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                        @click.self="closeImageSettings"
                    >
                        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl backdrop-blur-sm border border-gray-200">
                            <h3 class="text-xl font-bold text-gray-900 mb-4">Настройки изображения</h3>
                            
                            <!-- Превью изображения -->
                            <div 
                                class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
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
                                <label class="block text-sm font-medium text-gray-700 mb-2">
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
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>10%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            
                            <!-- Выравнивание -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
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
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
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
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
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
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
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
                    
                    <p class="mt-1 text-xs text-gray-500">
                        Используйте кнопки выше для форматирования текста
                    </p>
                </div>

                <!-- Описание -->
                <div>
                    <label for="desc" class="block text-sm font-medium text-gray-700 mb-2">
                        Краткое описание *
                    </label>
                    <textarea
                        id="desc"
                        v-model="newPost.desc"
                        rows="3"
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        placeholder="Введите краткое описание статьи"
                    ></textarea>
                </div>

                <!-- Категории -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Категории
                    </label>
                    <div v-if="categoriesLoading" class="text-gray-500">
                        Загрузка категорий...
                    </div>
                    <div v-else-if="categories.length > 0" class="space-y-2">
                        <label
                            v-for="category in categories"
                            :key="categoryRelId(category)"
                            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                            <input
                                type="checkbox"
                                :value="categoryRelId(category)"
                                v-model="newPost.categories"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span class="text-gray-700">{{ categoryTitle(category) }}</span>
                        </label>
                    </div>
                    <div v-else class="text-gray-500">
                        Категории не найдены
                    </div>
                    <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            v-model="newCategoryTitle"
                            type="text"
                            maxlength="120"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                            placeholder="Новая категория"
                            @keydown.enter.prevent="createCategory"
                        />
                        <button
                            type="button"
                            :disabled="categoryCreateSubmitting || !newCategoryTitle.trim()"
                            class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            @click="createCategory"
                        >
                            {{ categoryCreateSubmitting ? 'Создание…' : 'Создать категорию' }}
                        </button>
                    </div>
                    <p v-if="categoryCreateError" class="mt-2 text-sm text-red-600">{{ categoryCreateError }}</p>
                </div>

                <!-- Сообщения об ошибке и успехе -->
                <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-red-600">{{ error }}</p>
                </div>
                <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p class="text-green-600">{{ success }}</p>
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
                        <span v-if="!isSubmitting">{{ isEditMode ? 'Сохранить изменения' : 'Создать статью' }}</span>
                        <span v-else>{{ isEditMode ? 'Сохранение...' : 'Создание...' }}</span>
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Модальное окно предварительного просмотра (без flex items-center — иначе длинный контент не прокручивается) -->
        <div
            v-if="showPreview"
            ref="previewModalOverlayRef"
            class="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-6"
            @click.self="showPreview = false"
        >
            <div class="relative mx-auto my-8 w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl">
                <!-- Кнопка закрытия -->
                <button
                    @click="showPreview = false"
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <!-- Предварительный просмотр -->
                <div class="p-5 sm:p-6">
                    <!-- Изображение -->
                    <div v-if="imagePreview" class="mb-6 w-full" :style="coverPreviewStyles.figureStyle">
                        <div :style="coverPreviewStyles.innerWrapStyle">
                            <div
                                class="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-[0_22px_50px_-14px_rgba(15,23,42,0.22)] ring-1 ring-gray-900/8"
                                :style="coverPreviewStyles.boxStyle"
                            >
                                <img
                                    :src="imagePreview"
                                    alt="Превью статьи"
                                    class="absolute inset-0 h-full w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
                                    :class="coverPreviewStyles.imgClass"
                                    :style="coverPreviewStyles.imgStyle"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <!-- Заголовок -->
                    <h1 class="text-3xl font-bold mb-4 text-gray-900">
                        {{ newPost.title || 'Без названия' }}
                    </h1>
                    
                    <!-- Описание -->
                    <p v-if="newPost.desc" class="text-lg text-gray-800 mb-6">
                        {{ newPost.desc }}
                    </p>
                    
                    <!-- Дата публикации -->
                    <p class="text-sm text-gray-500 mb-8">
                        Дата публикации: {{ new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    
                    <!-- Контент статьи -->
                    <div 
                        ref="previewContentRef"
                        class="prose prose-lg max-w-none text-gray-900 whitespace-pre-wrap break-words"
                        v-html="newPost.body || '<p class=&quot;text-gray-500&quot;>Текст статьи отсутствует</p>'"
                    ></div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useSearchStore } from '~/stores/search';
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { STRAPI_BASE } from '~/utils/strapiBase'
import {
    DEFAULT_COVER_LAYOUT,
    mergeDescWithCover,
    parseDescWithCover,
    coverLayoutStyle
} from '~/utils/postCoverLayout';

const props = defineProps({
    documentId: {
        type: String,
        default: null
    }
})

const isEditMode = computed(() => !!props.documentId)

const search = useSearchStore();
const router = useRouter();
const base_url = STRAPI_BASE;

const newPost = ref({
    title: '',
    desc: '',
    body: '',
    categories: []
});

const imageFile = ref(null);
const imagePreview = ref(null);
const loadingPost = ref(false);
const postLoadError = ref('');
const existingCoverImageId = ref(null);
const initialCoverUrl = ref(null);
/** Настройки обложки (сохраняются в конце поля «краткое описание») */
const coverLayout = ref({ ...DEFAULT_COVER_LAYOUT });
const coverPreviewStyles = computed(() => coverLayoutStyle(coverLayout.value));
const coverAlignOptions = [
    { v: 'left', label: 'Слева' },
    { v: 'center', label: 'По центру' },
    { v: 'right', label: 'Справа' }
];
const categories = ref([]);
const categoriesLoading = ref(true);
const newCategoryTitle = ref('');
const categoryCreateSubmitting = ref(false);
const categoryCreateError = ref('');

/** Strapi 5: для связей REST — documentId; иначе числовой id (всегда строка для v-model чекбоксов) */
const categoryRelId = (c) => {
    if (!c) return '';
    const a = c.attributes;
    const documentId = c.documentId ?? a?.documentId;
    const id = c.id ?? a?.id;
    const v = documentId ?? id ?? '';
    return v === '' ? '' : String(v);
};

/** Обложка из ответа Strapi (разные формы вложенности) */
function normalizePostCoverImage(p) {
    if (!p?.img) return { url: null, id: null, documentId: null };
    let img = p.img;
    if (Array.isArray(img)) img = img[0];
    if (img?.data) img = Array.isArray(img.data) ? img.data[0] : img.data;
    const url = img?.url ?? img?.attributes?.url ?? null;
    const id = img?.id ?? img?.attributes?.id ?? null;
    const documentId = img?.documentId ?? img?.attributes?.documentId ?? null;
    return { url, id, documentId };
}
const categoryTitle = (c) => c?.title ?? c?.attributes?.title ?? '';

const normalizeCategoryRow = (raw) => {
    if (!raw) return null;
    const id = raw.id ?? raw.attributes?.id;
    const documentId = raw.documentId ?? raw.attributes?.documentId;
    const title = raw.title ?? raw.attributes?.title;
    if (documentId == null && id == null) return null;
    return { id, documentId, title: title ?? '' };
};
const isSubmitting = ref(false);
const error = ref('');
const success = ref('');
const editorRef = ref(null);

const EDITOR_BG_STORAGE_KEY = 'post_editor_surface_bg';

function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return { r: 23, g: 23, b: 23 };
    let h = hex.replace('#', '').trim();
    if (h.length === 3) {
        h = h.split('')
            .map((c) => c + c)
            .join('');
    }
    const n = parseInt(h, 16);
    if (Number.isNaN(n)) return { r: 23, g: 23, b: 23 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function isLightBackground(hex) {
    const { r, g, b } = hexToRgb(hex);
    const y = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return y > 0.55;
}

const editorSurfaceBg = ref('#171717');

const editorAutoTextColor = computed(() =>
    isLightBackground(editorSurfaceBg.value) ? '#111827' : '#f9fafb'
);

const editorPlaceholderColor = computed(() =>
    isLightBackground(editorSurfaceBg.value) ? '#6b7280' : '#9ca3af'
);

const editorLinkColor = computed(() =>
    isLightBackground(editorSurfaceBg.value) ? '#2563eb' : '#93c5fd'
);

const editorSurfaceStyle = computed(() => ({
    backgroundColor: editorSurfaceBg.value,
    color: editorAutoTextColor.value,
    '--editor-placeholder': editorPlaceholderColor.value,
    '--editor-link': editorLinkColor.value
}));

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
const previewModalOverlayRef = ref(null);
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
        nextTick(() => {
            previewModalOverlayRef.value?.scrollTo?.(0, 0);
        });
        // Применяем выравнивание после открытия модального окна
        applyPreviewImageAlignment();
    }
});

// Редактор монтируется только после снятия loadingPost — подставляем HTML, если первый sync не успел
watch(editorRef, (el) => {
    if (!el || !isEditMode.value || loadingPost.value) return;
    const body = newPost.value.body;
    if (body && String(el.innerHTML || '').trim() === '') {
        el.innerHTML = body;
        newPost.value.body = el.innerHTML;
        checkActiveFormats();
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
                // flex + justify-content: text-align не двигает block-img; см. applyEditorImageWrapStyles
                const imgHTML = `<div data-editor-img-wrap="true" data-align="left" style="display:flex;justify-content:flex-start;align-items:flex-start;width:100%;margin:10px 0;clear:both;"><img src="${imageUrl}" style="max-width:100%;height:auto;cursor:pointer;display:block;" alt="Изображение" /></div>`;
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

/** Обёртка картинки в редакторе: flex, чтобы центр/право работали для block-img */
const EDITOR_IMG_WRAP = 'data-editor-img-wrap';

function justifyContentForAlign(align) {
    if (align === 'center') return 'center';
    if (align === 'right') return 'flex-end';
    return 'flex-start';
}

function applyEditorImageWrapStyles(el, align) {
    if (!el || el.tagName !== 'DIV') return;
    el.setAttribute(EDITOR_IMG_WRAP, 'true');
    el.setAttribute('data-align', align);
    el.style.display = 'flex';
    el.style.justifyContent = justifyContentForAlign(align);
    el.style.alignItems = 'flex-start';
    el.style.width = '100%';
    el.style.margin = '10px 0';
    el.style.clear = 'both';
    el.style.textAlign = '';
}

function readAlignFromImgWrapper(img) {
    const parent = img?.parentElement;
    if (!parent || parent.tagName !== 'DIV') return 'left';
    const da = parent.getAttribute('data-align');
    if (da === 'center' || da === 'right' || da === 'left') return da;
    const jc = parent.style.justifyContent || window.getComputedStyle(parent).justifyContent;
    if (jc === 'center') return 'center';
    if (jc === 'flex-end' || jc === 'end') return 'right';
    const ta = parent.style.textAlign || window.getComputedStyle(parent).textAlign || '';
    if (ta === 'center' || ta === 'middle') return 'center';
    if (ta === 'right' || ta === 'end') return 'right';
    return 'left';
}

// Обработка клика в редакторе
const handleEditorClick = (e) => {
    // Открываем настройки изображения ТОЛЬКО при клике непосредственно на само изображение
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        
        const img = e.target;
        selectedImage.value = img;
        
        const width = img.style.width || img.getAttribute('width') || '100';
        const widthPercent = width.toString().replace('%', '') || '100';
        imageSettings.value.width = parseInt(widthPercent, 10);
        
        imageSettings.value.align = readAlignFromImgWrapper(img);
        
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
    
    if (parent && parent.tagName === 'DIV' && parent.children.length === 1 && parent.children[0] === img) {
        applyEditorImageWrapStyles(parent, align);
    } else {
        const imgClone = img.cloneNode(true);
        const newContainer = document.createElement('div');
        applyEditorImageWrapStyles(newContainer, align);
        newContainer.appendChild(imgClone);
        
        if (parent) {
            parent.replaceChild(newContainer, img);
        } else {
            editorRef.value?.appendChild(newContainer);
        }
        
        selectedImage.value = newContainer.querySelector('img');
    }
    
    updateBody();
};

// Обновление стиля изображения
const updateImageStyle = () => {
    if (!selectedImage.value) return;
    
    const img = selectedImage.value;
    const parent = img.parentElement;
    const align = imageSettings.value.align || readAlignFromImgWrapper(img);
    
    img.style.width = `${imageSettings.value.width}%`;
    img.style.height = 'auto';
    img.style.maxWidth = '100%';
    
    if (parent && parent.tagName === 'DIV') {
        applyEditorImageWrapStyles(parent, align);
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
        const raw = response.data || [];
        categories.value = raw.map(normalizeCategoryRow).filter(Boolean);
    } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        categories.value = [];
    } finally {
        categoriesLoading.value = false;
    }
};

const createCategory = async () => {
    const title = newCategoryTitle.value.trim();
    if (!title) return;
    categoryCreateError.value = '';
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!token) {
        categoryCreateError.value = 'Войдите в систему, чтобы создать категорию.';
        return;
    }
    categoryCreateSubmitting.value = true;
    try {
        const res = await fetch(`${base_url}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ data: { title } })
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
            const msg = payload.error?.message || payload.message || 'Не удалось создать категорию';
            throw new Error(msg);
        }
        const created = payload.data ?? payload;
        const row = normalizeCategoryRow(created);
        newCategoryTitle.value = '';
        await loadCategories();
        if (row && categoryRelId(row)) {
            const rid = categoryRelId(row);
            if (!newPost.value.categories.includes(rid)) {
                newPost.value.categories = [...newPost.value.categories, rid];
            }
        }
    } catch (e) {
        categoryCreateError.value = e.message || 'Ошибка при создании категории';
    } finally {
        categoryCreateSubmitting.value = false;
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
        imagePreview.value = isEditMode.value && initialCoverUrl.value ? initialCoverUrl.value : null;
        error.value = '';
    }
};

/** Заполнить contenteditable после того, как форма смонтирована (при загрузке редактор был скрыт v-if) */
function syncEditorFromLoadedBody() {
    if (!editorRef.value) return;
    const html = newPost.value.body || '';
    editorRef.value.innerHTML = html;
    newPost.value.body = editorRef.value.innerHTML;
    checkActiveFormats();
}

const loadPostForEdit = async () => {
    if (!props.documentId) return;
    loadingPost.value = true;
    postLoadError.value = '';
    try {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null;
        const authOpts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        let res;
        try {
            res = await $fetch(`${base_url}/api/posts/${props.documentId}?populate=*`, authOpts);
        } catch (e) {
            res = await $fetch(`${base_url}/api/posts/${props.documentId}?populate=*`);
        }
        const p = res.data;
        if (!p) throw new Error('empty');
        const { cleanDesc, layout } = parseDescWithCover(p.desc || '');
        const catIds = (p.categories || [])
            .map((c) => categoryRelId(c))
            .filter((x) => x != null && x !== '');
        const bodyHtml = typeof p.body === 'string' ? p.body : '';

        newPost.value = {
            title: p.title || '',
            desc: cleanDesc,
            body: bodyHtml,
            categories: catIds
        };
        coverLayout.value = { ...DEFAULT_COVER_LAYOUT, ...layout };

        const cover = normalizePostCoverImage(p);
        existingCoverImageId.value = cover.id ?? cover.documentId ?? null;
        if (cover.url) {
            const u = cover.url.startsWith('http') ? cover.url : base_url + cover.url;
            initialCoverUrl.value = u;
            imagePreview.value = u;
        } else {
            initialCoverUrl.value = null;
            imagePreview.value = null;
        }
        imageFile.value = null;
    } catch (err) {
        console.error('Ошибка загрузки поста:', err);
        postLoadError.value = 'Не удалось загрузить статью. Проверьте ссылку и права доступа.';
    } finally {
        loadingPost.value = false;
    }
    await nextTick();
    await nextTick();
    syncEditorFromLoadedBody();
};

const parseUploadImageId = (uploadData) => {
    if (Array.isArray(uploadData)) {
        return uploadData[0]?.id || uploadData[0]?.documentId;
    }
    return uploadData?.id || uploadData?.documentId;
};

// Создание или обновление статьи
const savePost = async () => {
    isSubmitting.value = true;
    error.value = '';
    success.value = '';

    try {
        let imageId = null;
        if (imageFile.value) {
            const formData = new FormData();
            formData.append('files', imageFile.value);

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
                        const errorText = await uploadResponse.text().catch(() => '');
                        if (errorText.includes('413') || errorText.includes('Request Entity Too Large')) {
                            errorMessage = `Размер файла слишком большой. Пожалуйста, выберите изображение размером менее ${MAX_FILE_SIZE_MB} МБ.`;
                        }
                    }
                }
                
                throw new Error(errorMessage);
            }

            const uploadData = await uploadResponse.json();
            imageId = parseUploadImageId(uploadData);
        }

        const token = localStorage.getItem('jwt');
        const postData = {
            data: {
                title: newPost.value.title,
                desc: mergeDescWithCover(newPost.value.desc, coverLayout.value),
                body: newPost.value.body
            }
        };

        if (!isEditMode.value) {
            postData.data.publishedAt = new Date().toISOString();
        }

        if (imageId) {
            postData.data.img = imageId;
        } else if (isEditMode.value && existingCoverImageId.value) {
            postData.data.img = existingCoverImageId.value;
        }

        // Strapi 5 REST: связи через documentId и объект { set: [...] }
        const catIds = newPost.value.categories.filter((x) => x != null && x !== '');
        if (catIds.length > 0) {
            postData.data.categories = { set: catIds };
        } else if (isEditMode.value) {
            postData.data.categories = { set: [] };
        }

        const url = isEditMode.value
            ? `${base_url}/api/posts/${props.documentId}`
            : `${base_url}/api/posts`;
        const method = isEditMode.value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Ошибка сохранения поста:', errorData);
            
            let errorMessage = errorData.error?.message || errorData.message || (isEditMode.value ? 'Ошибка при сохранении статьи' : 'Ошибка при создании статьи');
            
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
            
            if (response.status === 403 || errorMessage.toLowerCase().includes('forbidden')) {
                errorMessage = 'Недостаточно прав для сохранения. Войдите как автор статьи.';
            }
            
            throw new Error(errorMessage);
        }

        if (isEditMode.value) {
            success.value = 'Изменения сохранены!';
            setTimeout(() => {
                router.push(`/post/${props.documentId}`);
            }, 1200);
        } else {
            success.value = 'Статья успешно создана!';
            newPost.value = {
                title: '',
                desc: '',
                body: '',
                categories: []
            };
            coverLayout.value = { ...DEFAULT_COVER_LAYOUT };
            if (editorRef.value) {
                editorRef.value.innerHTML = '';
            }
            imageFile.value = null;
            imagePreview.value = null;

            setTimeout(() => {
                router.push('/blog');
            }, 2000);
        }

    } catch (err) {
        console.error('Ошибка при сохранении статьи:', err);
        error.value = err.message || (isEditMode.value ? 'Не удалось сохранить статью' : 'Не удалось создать статью');
    } finally {
        isSubmitting.value = false;
    }
};

watch(editorSurfaceBg, (v) => {
    if (!process.client) return;
    try {
        if (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)) {
            localStorage.setItem(EDITOR_BG_STORAGE_KEY, v);
        }
    } catch {
        /* ignore */
    }
});

onMounted(async () => {
    if (process.client) {
        try {
            document.execCommand('defaultParagraphSeparator', false, 'p');
        } catch {
            /* не все браузеры поддерживают */
        }
        try {
            const saved = localStorage.getItem(EDITOR_BG_STORAGE_KEY);
            if (saved && /^#[0-9a-fA-F]{6}$/.test(saved)) {
                editorSurfaceBg.value = saved;
            }
        } catch {
            /* ignore */
        }
        await loadCategories();
        if (props.documentId) {
            await loadPostForEdit();
        }
    }
});

useHead(() => ({
    title: isEditMode.value ? 'Редактирование статьи' : 'Консоль — Блог'
}))
</script>

<style scoped>
/* Редактор: фон и цвет текста задаются через editorSurfaceStyle (см. выбор «Фон поля») */
#editor:empty:before {
    content: attr(data-placeholder);
    color: var(--editor-placeholder, #9ca3af);
    pointer-events: none;
}

#editor {
    line-height: 1.7;
    /* Сохраняем пробелы и переносы строк; без ручного перехвата пробела (он ломал ввод в части браузеров) */
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: normal;
    user-select: text;
    -webkit-user-select: text;
}

/* Видимый зазор между абзацами и строками-блоками (как в обычном тексте) */
#editor p {
    margin: 0.55em 0;
}

#editor > div:not([data-editor-img-wrap]) {
    margin: 0.45em 0;
    min-height: 1.45em;
}

#editor > div:not([data-editor-img-wrap]):empty {
    min-height: 1.45em;
}

#editor :deep(a) {
    color: var(--editor-link, #93c5fd);
}

#editor h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
    color: inherit;
}

#editor h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.75em 0;
    color: inherit;
}

#editor h3 {
    font-size: 1.17em;
    font-weight: bold;
    margin: 0.83em 0;
    color: inherit;
}

#editor h4 {
    font-size: 1em;
    font-weight: bold;
    margin: 1em 0;
    color: inherit;
}

#editor ul, #editor ol {
    margin: 1em 0;
    padding-left: 2em;
}

#editor li {
    margin: 0.5em 0;
}

/* Обёртки картинок: flex + justify-content (text-align не центрирует display:block img) */
#editor div[data-editor-img-wrap],
.prose div[data-editor-img-wrap] {
    display: flex !important;
    width: 100% !important;
    margin: 10px 0 !important;
    clear: both !important;
    align-items: flex-start !important;
}

#editor div[data-editor-img-wrap] img,
.prose div[data-editor-img-wrap] img {
    display: block;
    max-width: 100%;
    height: auto;
}

/* Старые посты: только text-align без data-editor-img-wrap */
#editor div[style*="text-align"] img,
.prose div[style*="text-align"] img {
    display: inline-block;
    max-width: 100%;
    height: auto;
    vertical-align: top;
}

#editor div[style*="text-align: center"] img,
#editor div[style*="text-align:center"] img,
.prose div[style*="text-align: center"] img,
.prose div[style*="text-align:center"] img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

#editor div[style*="text-align: right"] img,
#editor div[style*="text-align:right"] img,
.prose div[style*="text-align: right"] img,
.prose div[style*="text-align:right"] img {
    display: block;
    margin-left: auto;
    margin-right: 0;
}
</style>
