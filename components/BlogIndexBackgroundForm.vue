<template>
    <div>
        <div v-if="!search.userMe?.id" class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-950">
            <NuxtLink to="/admin" class="font-semibold underline">Войдите</NuxtLink>, чтобы загрузить картинку на сервер.
        </div>

        <div v-else class="space-y-8">
            <div class="mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
                <div class="flex w-full flex-col gap-4 lg:sticky lg:top-24">
                    <div
                        v-if="previewUrl"
                        class="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-inner"
                        style="aspect-ratio: 16 / 10; max-height: min(52vh, 420px)"
                    >
                        <div class="pointer-events-none absolute inset-0">
                            <div class="absolute inset-0" :style="previewLayerStyle" />
                            <div class="absolute inset-0" :style="previewOverlayStyle" />
                        </div>
                    </div>
                    <div
                        v-else
                        class="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-sm text-gray-500"
                        style="aspect-ratio: 16 / 10; max-height: min(52vh, 420px)"
                    >
                        Загрузите файл ниже — здесь появится предпросмотр
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium text-gray-700">Файл изображения</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            class="block w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                            @change="onFile"
                        />
                        <p class="mt-1 text-xs text-gray-500">До 10 МБ, JPG / PNG / GIF / WebP.</p>
                    </div>
                </div>

                <div class="min-w-0 space-y-4">
                    <template v-if="previewUrl">
                        <h3 class="text-base font-semibold text-gray-800">Настройки фона</h3>
                        <p class="text-xs text-gray-500">
                            {{ bgHintText }}
                        </p>

                        <label class="block text-xs text-gray-600">
                            Вписать в экран
                            <select
                                v-model="effects.fit"
                                class="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                            >
                                <option value="cover">Обрезать по краям (cover)</option>
                                <option value="contain">Целиком (contain)</option>
                                <option value="fill">Растянуть (fill)</option>
                            </select>
                        </label>

                        <div class="max-h-[min(55vh,520px)] space-y-3 overflow-y-auto pr-1">
                            <label
                                v-for="row in effectSliders"
                                :key="row.key"
                                class="block text-xs text-gray-600"
                            >
                                {{ row.label }}
                                <span class="float-right font-mono text-gray-800">{{ Math.round(effects[row.key]) }}{{ row.unit }}</span>
                                <input
                                    v-model.number="effects[row.key]"
                                    type="range"
                                    :min="row.min"
                                    :max="row.max"
                                    step="1"
                                    class="mt-1 h-2 w-full cursor-pointer accent-blue-600"
                                />
                            </label>
                        </div>

                        <p v-if="savedUrl && !pendingFile" class="text-xs text-gray-500">
                            Оформление сохраняется автоматически.
                        </p>

                        <button
                            type="button"
                            class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                            @click="resetEffects"
                        >
                            Сбросить оформление
                        </button>
                    </template>
                    <p v-else class="rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-6 text-sm text-gray-600">
                        Когда изображение выбрано, здесь появятся слайдеры яркости, контраста и остальные настройки.
                    </p>
                </div>
            </div>

            <div class="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 border-t border-gray-100 pt-6">
                <button
                    type="button"
                    :disabled="!pendingFile"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="saveBackground"
                >
                    {{ saving ? 'Сохранение…' : 'Загрузить и сохранить фон' }}
                </button>
                <button
                    type="button"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    @click="resetBackground"
                >
                    Как по умолчанию
                </button>
            </div>

            <p
                v-if="message"
                class="text-center text-sm"
                :class="messageOk ? 'text-green-600' : 'text-red-600'"
            >
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useSearchStore } from '~/stores/search';
import { STRAPI_BASE } from '~/utils/strapiBase'
import {
    DEFAULT_BLOG_BG_EFFECTS,
    loadPageBgState,
    savePageBgState,
    clearPageBgState,
    buildCustomBgLayerStyle,
    buildCustomBgOverlayStyle,
    normalizeBlogBgState
} from '~/utils/blogIndexBg';

const props = defineProps({
    pageId: {
        type: String,
        default: 'index',
        validator: (v) => v === 'index' || v === 'contact' || v === 'interests'
    }
});

const search = useSearchStore();
const base_url = STRAPI_BASE;

const previewUrl = ref('');
const pendingFile = ref(null);
const savedUrl = ref('');
const saving = ref(false);
const message = ref('');
const messageOk = ref(true);

const effects = reactive({ ...DEFAULT_BLOG_BG_EFFECTS });

const bgHintText = computed(() => {
    if (props.pageId === 'contact') {
        return 'Меняется только картинка фона; текст книги на странице «Моя история» не затрагивается.';
    }
    if (props.pageId === 'interests') {
        return 'Меняется только картинка фона; карточки статей не затрагиваются. На сайте фон — на высоту одного экрана и не прокручивается со списком. Режим «Вписать в экран» (обрезка / целиком / растяжение) действует и в предпросмотре, и на странице «Мои интересы».';
    }
    return 'Меняется только картинка фона; текст и блокнот на главной не затрагиваются.';
});

const effectSliders = [
    { key: 'posX', label: 'Позиция по горизонтали', min: 0, max: 100, unit: '%' },
    { key: 'posY', label: 'Позиция по вертикали', min: 0, max: 100, unit: '%' },
    { key: 'brightness', label: 'Яркость', min: 30, max: 200, unit: '%' },
    { key: 'contrast', label: 'Контраст', min: 30, max: 200, unit: '%' },
    { key: 'saturation', label: 'Насыщенность', min: 0, max: 200, unit: '%' },
    { key: 'hue', label: 'Оттенок', min: 0, max: 360, unit: '°' },
    { key: 'blur', label: 'Размытие', min: 0, max: 16, unit: 'px' },
    { key: 'overlay', label: 'Затемнение', min: 0, max: 85, unit: '%' },
    { key: 'vignette', label: 'Виньетка по краям', min: 0, max: 100, unit: '%' }
];

const previewState = computed(() => ({
    url: previewUrl.value || '',
    ...effects
}));

const previewLayerStyle = computed(() => buildCustomBgLayerStyle(previewState.value));
const previewOverlayStyle = computed(() => buildCustomBgOverlayStyle(previewState.value));

const MAX_MB = 10;

let persistTimer;

onMounted(() => {
    if (!process.client) return;
    const state = loadPageBgState(props.pageId);
    if (state?.url) {
        savedUrl.value = state.url;
        previewUrl.value = state.url;
        Object.assign(effects, {
            brightness: state.brightness,
            contrast: state.contrast,
            saturation: state.saturation,
            blur: state.blur,
            hue: state.hue,
            overlay: state.overlay,
            vignette: state.vignette,
            posX: state.posX,
            posY: state.posY,
            fit: state.fit
        });
    }
});

watch(
    () => ({ ...effects }),
    () => {
        if (!savedUrl.value || pendingFile.value) return;
        clearTimeout(persistTimer);
        persistTimer = setTimeout(() => {
            savePageBgState(props.pageId, { url: savedUrl.value, ...effects });
        }, 450);
    },
    { deep: true }
);

const onFile = (e) => {
    message.value = '';
    const file = e.target.files?.[0];
    if (!file) {
        pendingFile.value = null;
        previewUrl.value = savedUrl.value || '';
        return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
        message.value = `Файл больше ${MAX_MB} МБ.`;
        messageOk.value = false;
        pendingFile.value = null;
        return;
    }
    pendingFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
};

const resetEffects = () => {
    Object.assign(effects, DEFAULT_BLOG_BG_EFFECTS);
    if (savedUrl.value) {
        savePageBgState(props.pageId, { url: savedUrl.value, ...effects });
    }
    message.value = 'Оформление сброшено.';
    messageOk.value = true;
};

const saveBackground = async () => {
    message.value = '';
    if (!pendingFile.value) {
        message.value = 'Выберите файл.';
        messageOk.value = false;
        return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
        message.value = 'Нужна авторизация.';
        messageOk.value = false;
        return;
    }

    saving.value = true;
    try {
        const formData = new FormData();
        formData.append('files', pendingFile.value);

        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || err.error?.message || 'Ошибка загрузки');
        }

        const data = await res.json();
        const fileData = Array.isArray(data) ? data[0] : data;
        const path = fileData?.url;
        if (!path) throw new Error('Нет URL файла');

        const fullUrl = path.startsWith('http') ? path : `${base_url}${path}`;
        const merged = normalizeBlogBgState({ url: fullUrl, ...effects });
        savePageBgState(props.pageId, merged);
        savedUrl.value = fullUrl;
        previewUrl.value = fullUrl;
        pendingFile.value = null;
        message.value = 'Фон и оформление сохранены.';
        messageOk.value = true;
    } catch (err) {
        message.value = err.message || 'Не удалось сохранить';
        messageOk.value = false;
    } finally {
        saving.value = false;
    }
};

const resetBackground = () => {
    clearPageBgState(props.pageId);
    savedUrl.value = '';
    previewUrl.value = '';
    pendingFile.value = null;
    Object.assign(effects, DEFAULT_BLOG_BG_EFFECTS);
    message.value = 'Включён фон по умолчанию.';
    messageOk.value = true;
};
</script>
