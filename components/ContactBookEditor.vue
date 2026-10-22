<template>
    <Teleport to="body">
        <div
            v-if="modelValue"
            class="contact-book-editor-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-book-editor-title"
            @click.self="close"
            @keydown.esc.prevent="close"
        >
            <div
                class="contact-book-editor-panel max-h-[min(92vh,720px)] w-full max-w-2xl overflow-hidden rounded-lg border border-[#c4b59a] bg-[#fdfaf5] shadow-2xl"
            >
                <div class="flex items-center justify-between gap-2 border-b border-[#e8dfd0] bg-[#f5efe6] px-4 py-3">
                    <h2 id="contact-book-editor-title" class="text-lg font-semibold text-[#3d3428]">
                        Редактировать разворот
                    </h2>
                    <button
                        type="button"
                        class="rounded p-1 text-[#6b5a4a] hover:bg-black/5 hover:text-[#1a1510]"
                        aria-label="Закрыть"
                        @click="close"
                    >
                        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="max-h-[min(78vh,620px)] overflow-y-auto px-4 py-3">
                    <p class="mb-3 text-sm leading-snug text-[#5a4a3a]">
                        Текст — Markdown. Фото на левом листе: загрузите файл ниже или первая строка
                        <code class="rounded bg-black/5 px-1 font-mono text-xs">![](/uploads/…)</code>
                    </p>

                    <div class="mb-4 rounded-lg border border-[#e0d5c5] bg-[#faf7f2] p-3">
                        <div class="mb-2 text-sm font-medium text-[#4a3d32]">Фото на левый лист</div>
                        <div class="flex flex-wrap items-start gap-3">
                            <div
                                class="flex h-36 w-28 shrink-0 items-center justify-center overflow-hidden rounded border border-[#d4c9b8] bg-[#f0ebe3] text-xs text-[#8b7355]"
                            >
                                <img
                                    v-if="photoPreviewUrl"
                                    :src="photoPreviewUrl"
                                    alt=""
                                    class="h-full w-full object-cover"
                                />
                                <span v-else class="px-2 text-center">Нет фото</span>
                            </div>
                            <div class="flex min-w-0 flex-1 flex-col gap-2">
                                <input
                                    ref="fileInputRef"
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="onPhotoFile"
                                />
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        class="rounded border border-[#a08b6a] bg-white px-3 py-1.5 text-sm text-[#4a3d32] hover:bg-[#f5efe6] disabled:opacity-50"
                                        :disabled="uploadingPhoto || saving"
                                        @click="openFilePicker"
                                    >
                                        {{ uploadingPhoto ? 'Загрузка…' : 'Выбрать файл' }}
                                    </button>
                                    <button
                                        v-if="photoPreviewUrl"
                                        type="button"
                                        class="rounded border border-red-200 bg-white px-3 py-1.5 text-sm text-red-800 hover:bg-red-50 disabled:opacity-50"
                                        :disabled="uploadingPhoto || saving"
                                        @click="removePhoto"
                                    >
                                        Убрать фото
                                    </button>
                                </div>
                                <p class="text-xs text-[#7a6a5a]">
                                    Размер в редакторе не ограничен; тяжёлые файлы грузятся прямо в Strapi. Если загрузка оборвётся, увеличьте
                                    <code class="rounded bg-black/5 px-0.5">client_max_body_size</code> в nginx у Strapi.
                                </p>
                            </div>
                        </div>
                    </div>

                    <template v-if="titleStrapiKey">
                        <label class="mb-2 block text-sm font-medium text-[#4a3d32]">Заголовок</label>
                        <input
                            v-model="draftTitle"
                            type="text"
                            class="mb-4 w-full rounded border border-[#d4c9b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] shadow-inner focus:border-[#8b7355] focus:outline-none focus:ring-1 focus:ring-[#8b7355]"
                            placeholder="Необязательно"
                            autocomplete="off"
                        />
                    </template>
                    <p v-else class="mb-4 text-sm italic text-[#8b7355]">
                        Поля заголовка нет в ответе Strapi (или оно не называется title / name / heading …). Добавьте такое поле в тип
                        <code class="rounded bg-black/5 px-1 font-mono text-xs">about</code>
                        или задайте заголовок в админке Strapi.
                    </p>

                    <label class="mb-2 block text-sm font-medium text-[#4a3d32]">Текст разворота</label>
                    <textarea
                        v-model="draftContent"
                        rows="16"
                        class="w-full resize-y rounded border border-[#d4c9b8] bg-white px-3 py-2 font-mono text-[13px] leading-relaxed text-[#1f1f1f] shadow-inner focus:border-[#8b7355] focus:outline-none focus:ring-1 focus:ring-[#8b7355] md:text-sm"
                        spellcheck="false"
                    />
                </div>

                <div class="flex flex-wrap items-center justify-end gap-2 border-t border-[#e8dfd0] bg-[#faf7f2] px-4 py-3">
                    <span v-if="saveError" class="mr-auto max-w-[70%] text-sm text-red-700">{{ saveError }}</span>
                    <span v-else-if="saveOk" class="mr-auto text-sm text-green-800">{{ saveOk }}</span>
                    <button
                        type="button"
                        class="rounded border border-[#c4b59a] bg-white px-4 py-2 text-sm text-[#4a3d32] hover:bg-[#f5efe6]"
                        :disabled="saving"
                        @click="close"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        class="rounded bg-[#6b5a4a] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a4a3a] disabled:opacity-50"
                        :disabled="saving || !canSave"
                        @click="save"
                    >
                        {{ saving ? 'Сохранение…' : 'Сохранить в Strapi' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import {
    getAboutEntryForEditor,
    mergeLeadImageIntoMarkdown,
    spreadFromAboutEntry
} from '~/utils/contactBookSpread';
import { STRAPI_BASE } from '~/utils/strapiBase';

/** Сообщение об ошибке Strapi 4/5 (validation, unknown fields) */
function formatStrapiErr(errJson) {
    const e = errJson?.error;
    if (!e) return errJson?.message || null;
    const errs = e.details?.errors;
    if (Array.isArray(errs) && errs.length) {
        const parts = errs.map((x) => (x.path ? `${x.path.join?.('.') || x.path}: ` : '') + (x.message || ''));
        return parts.filter(Boolean).join('; ') || e.message;
    }
    return e.message || null;
}

/** Черновик тела в записи Strapi для предпросмотра фото */
function entryWithDraftBody(entry, body) {
    if (!entry || typeof entry !== 'object') return null;
    const attrs = entry.attributes;
    if (attrs && typeof attrs === 'object') {
        return { ...entry, attributes: { ...attrs, content: body, text: body } };
    }
    return { ...entry, content: body, text: body };
}

/** Убрать связи с медиа (для превью после «Убрать фото», пока не сохранили) */
function stripAboutMediaFields(entry) {
    if (!entry || typeof entry !== 'object') return entry;
    const keys = ['image', 'cover', 'photo', 'picture'];
    const attrs = entry.attributes;
    if (attrs && typeof attrs === 'object') {
        const next = { ...attrs };
        for (const k of keys) delete next[k];
        return { ...entry, attributes: next };
    }
    const next = { ...entry };
    for (const k of keys) delete next[k];
    return next;
}

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    /** сырая запись из API /api/abouts */
    entry: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const draftTitle = ref('');
const draftContent = ref('');
const saving = ref(false);
const saveError = ref('');
const saveOk = ref('');
const fileInputRef = ref(null);
const uploadingPhoto = ref(false);
/** после загрузки/снятия фото — сбросить поле image в Strapi, чтобы слева шла картинка из markdown */
const clearStrapiImageOnSave = ref(false);

const bodyField = ref('content');
/** Ключ поля заголовка в Strapi — только если он есть в GET; иначе PUT с «title» даёт 400 */
const titleStrapiKey = ref(null);

const photoPreviewUrl = computed(() => {
    let e = entryWithDraftBody(props.entry, draftContent.value);
    if (!e) return null;
    if (clearStrapiImageOnSave.value) {
        e = stripAboutMediaFields(e);
    }
    return spreadFromAboutEntry(e).imageUrl || null;
});

const canSave = computed(() => {
    const { documentId, id } = getAboutEntryForEditor(props.entry);
    return Boolean(documentId || id);
});

function syncFromEntry() {
    const { title, content, bodyField: bf, titleStrapiKey: tk } = getAboutEntryForEditor(props.entry);
    titleStrapiKey.value = tk;
    draftTitle.value = title;
    draftContent.value = content;
    bodyField.value = bf || 'content';
    clearStrapiImageOnSave.value = false;
    saveError.value = '';
    saveOk.value = '';
    if (fileInputRef.value) fileInputRef.value.value = '';
}

function parseUploadFileUrl(uploadData) {
    const item = Array.isArray(uploadData) ? uploadData[0] : uploadData;
    if (!item || typeof item !== 'object') return null;
    const url =
        item.url ||
        item.attributes?.url ||
        item?.formats?.large?.url ||
        item?.formats?.medium?.url;
    return typeof url === 'string' ? url : null;
}

/** Сначала прямо в Strapi (без лимита прокси Nuxt), при ошибке — через `/api/upload`. */
async function uploadImageToStrapi(file) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!token) throw new Error('Нужна авторизация для загрузки.');

    const formData = new FormData();
    formData.append('files', file);

    let response = null;
    try {
        response = await fetch(`${STRAPI_BASE}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
    } catch {
        response = null;
    }

    if (!response || !response.ok) {
        response = await fetch('/api/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
    }

    if (!response.ok) {
        const text = await response.text();
        let msg = `Загрузка: ${response.status}`;
        try {
            const j = JSON.parse(text);
            msg = formatStrapiErr(j) || j.message || j.error?.message || msg;
        } catch {
            if (text) msg += ` — ${text.slice(0, 180)}`;
        }
        if (response.status === 413) {
            msg =
                'Файл слишком большой для сервера. Увеличьте client_max_body_size в nginx у Strapi (и у Nuxt, если грузите через прокси).';
        }
        throw new Error(msg);
    }

    return response.json();
}

async function onPhotoFile(event) {
    const input = event.target;
    const file = input?.files?.[0];
    if (!file) return;

    uploadingPhoto.value = true;
    saveError.value = '';

    try {
        const uploadData = await uploadImageToStrapi(file);
        const url = parseUploadFileUrl(uploadData);
        if (!url) throw new Error('Ответ загрузки без URL.');

        let relativeUrl = url;
        if (url.startsWith('http')) {
            try {
                relativeUrl = new URL(url).pathname;
            } catch {
                relativeUrl = url;
            }
        }

        draftContent.value = mergeLeadImageIntoMarkdown(draftContent.value, relativeUrl, false);
        clearStrapiImageOnSave.value = true;
    } catch (e) {
        saveError.value = e?.message || 'Ошибка загрузки.';
    } finally {
        uploadingPhoto.value = false;
        input.value = '';
    }
}

function openFilePicker() {
    fileInputRef.value?.click();
}

function removePhoto() {
    draftContent.value = mergeLeadImageIntoMarkdown(draftContent.value, null, true);
    clearStrapiImageOnSave.value = true;
    saveError.value = '';
}

watch(
    () => [props.modelValue, props.entry],
    () => {
        if (props.modelValue) syncFromEntry();
    },
    { immediate: true }
);

function close() {
    emit('update:modelValue', false);
    saveError.value = '';
    saveOk.value = '';
}

async function save() {
    const { documentId, id } = getAboutEntryForEditor(props.entry);
    const docId = documentId || id;
    if (!docId) {
        saveError.value = 'Нет идентификатора записи.';
        return;
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!token) {
        saveError.value = 'Нужна авторизация.';
        return;
    }

    saving.value = true;
    saveError.value = '';
    saveOk.value = '';

    const data = { [bodyField.value]: draftContent.value };
    const tk = titleStrapiKey.value;
    if (tk) {
        data[tk] = draftTitle.value.trim();
    }
    /** Не отправляем лишние поля (например `title`, если его нет в схеме) — 400. Картинка — через `![](/uploads/…)` в тексте. */

    try {
        const url = `${STRAPI_BASE}/api/abouts/${docId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            const msg =
                formatStrapiErr(errJson) ||
                errJson.error?.message ||
                errJson.message ||
                (response.status === 403 ? 'Недостаточно прав (проверьте роль в Strapi).' : `Ошибка ${response.status}`);
            throw new Error(msg);
        }

        saveOk.value = 'Сохранено.';
        emit('saved');
        setTimeout(() => {
            close();
        }, 600);
    } catch (e) {
        saveError.value = e?.message || 'Не удалось сохранить.';
    } finally {
        saving.value = false;
    }
}
</script>
