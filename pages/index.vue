<template>
    <div class="phoneMain" :class="{ 'phoneMain--custom-bg': blogBgState?.url }">
        <div v-if="blogBgState?.url" class="phoneMain-bg" aria-hidden="true">
            <div class="phoneMain-bg-layer" :style="customBgLayerStyle" />
            <div class="phoneMain-bg-overlay" :style="customBgOverlayStyle" />
        </div>
        <!-- Центральная часть: левые фото привязаны к блокноту (~⅓ под ним) -->
        <div
            class="center-content"
            :class="{ 'center-content--page-open': mobileNotebookOpen }"
            v-if="index.config.primeryBlock"
            :role="isMobileNotebook ? 'button' : undefined"
            :tabindex="isMobileNotebook ? 0 : undefined"
            :aria-expanded="isMobileNotebook ? mobileNotebookOpen : undefined"
            :aria-label="isMobileNotebook ? (mobileNotebookOpen ? 'Закрыть страницу блокнота' : 'Открыть страницу с текстом') : undefined"
            @click="onNotebookTap"
            @keydown.enter.prevent="onNotebookTap"
            @keydown.space.prevent="onNotebookTap"
        >
            <div class="left-images">
                <img src="/img/notebook-sea.png" alt="Картинка 1" class="image-left-top">
                <img src="/img/notebook-mountains.png" alt="Картинка 2" class="image-left-bottom">
            </div>
            <div class="notebook-clip">
                <img src="/img/notebook-zebra.png" alt="Картинка 3" class="center-image">
            </div>
            <button
                v-if="isMobileNotebook && mobileNotebookOpen"
                type="button"
                class="notebook-back-btn"
                @click.stop="mobileNotebookOpen = false"
            >
                Назад
            </button>
            <!-- Режим просмотра -->
            <div
                v-if="!isEditing"
                class="textKra"
                v-html="notebookText"
            ></div>
            <!-- Режим редактирования — панель как в книге -->
            <div v-else class="textKra-editor">
                <div
                    class="notebook-fmt-toolbar"
                    role="toolbar"
                    aria-label="Форматирование текста"
                >
                    <button
                        type="button"
                        class="notebook-fmt-btn font-bold"
                        title="Жирный"
                        @mousedown.prevent
                        @click="applyNotebookFormat('bold')"
                    >
                        Ж
                    </button>
                    <button
                        type="button"
                        class="notebook-fmt-btn italic"
                        title="Курсив"
                        @mousedown.prevent
                        @click="applyNotebookFormat('italic')"
                    >
                        К
                    </button>
                    <button
                        type="button"
                        class="notebook-fmt-btn underline"
                        title="Подчёркнутый"
                        @mousedown.prevent
                        @click="applyNotebookFormat('underline')"
                    >
                        Ч
                    </button>
                    <select
                        v-model="draftFontSize"
                        class="notebook-fmt-select"
                        title="Размер текста"
                        aria-label="Размер текста"
                        @mousedown.stop
                        @change="applyNotebookFormat('size')"
                    >
                        <option
                            v-for="opt in BOOK_FONT_SIZE_OPTIONS"
                            :key="opt.value"
                            :value="opt.value"
                        >
                            {{ opt.label }}
                        </option>
                    </select>
                    <label
                        class="notebook-fmt-btn relative inline-flex cursor-pointer items-center justify-center"
                        title="Цвет текста"
                    >
                        <span aria-hidden="true">А</span>
                        <span
                            class="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-sm"
                            :style="{ background: draftTextColor }"
                        />
                        <input
                            v-model="draftTextColor"
                            type="color"
                            class="absolute inset-0 cursor-pointer opacity-0"
                            @mousedown.prevent
                            @change="applyNotebookFormat('color')"
                        />
                    </label>
                    <button
                        type="button"
                        class="notebook-fmt-btn"
                        title="Ссылка"
                        @mousedown.prevent
                        @click="applyNotebookFormat('link')"
                    >
                        URL
                    </button>
                </div>
                <textarea
                    ref="notebookEditRef"
                    v-model="editingText"
                    class="textKra textKra-edit"
                    aria-label="Текст блокнота"
                    @mousedown.stop
                    @keydown.stop="onNotebookKeydown"
                    @keyup.stop
                    @keypress.stop
                    @input="onNotebookInput"
                />
                <div class="notebook-edit-meta">
                    <span
                        class="notebook-char-count"
                        :class="{ 'notebook-char-count--full': notebookPlainLen >= NOTEBOOK_BODY_MAX_CHARS }"
                    >
                        {{ notebookPlainLen }} / {{ NOTEBOOK_BODY_MAX_CHARS }}
                    </span>
                </div>
            </div>
            <!-- Кнопки управления — только администратор контента -->
            <div v-if="canManageContent" class="edit-controls" @click.stop>
                <button
                    v-if="!isEditing"
                    type="button"
                    class="edit-btn"
                    title="Редактировать текст"
                    @click="startEdit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <div v-else class="edit-buttons">
                    <button type="button" class="save-btn" title="Сохранить (Ctrl+Enter)" @click="saveText">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </button>
                    <button type="button" class="cancel-btn" title="Отмена (Esc)" @click="cancelEdit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="quote-container">
                <blockquote
                    class="quote"
                    aria-label="Мы все, как карандаши. Каждый рисует свою судьбу. Один ломается, другой тупит, а кто-то затачивается и движется вперёд."
                >
                    <span
                        v-for="(line, lineIdx) in quoteWaveLines"
                        :key="'ql' + lineIdx"
                        class="quote-line"
                    >
                        <span
                            v-for="(item, i) in line"
                            :key="'q' + lineIdx + '-' + i"
                            class="quote-char"
                            :class="{ 'quote-char--space': item.space }"
                            :style="waveCharStyle(lineIdx, i)"
                            aria-hidden="true"
                        >{{ item.ch }}</span>
                    </span>
                </blockquote>
                <p class="author" aria-label="Светлана Кременецкая">
                    <span
                        v-for="(item, i) in authorWaveChars"
                        :key="'a' + i"
                        class="quote-char"
                        :class="{ 'quote-char--space': item.space }"
                        :style="waveCharStyle(quoteWaveLines.length, i)"
                        aria-hidden="true"
                    >{{ item.ch }}</span>
                </p>
            </div>
            <!-- Карандаши у правого нижнего угла блокнота, чуть ниже -->
            <div class="right-images" aria-hidden="true">
                <img src="/img/swirl-large.png" alt="" class="image-right-bottom">
                <img src="/img/pencil.png" alt="" class="image-right-top">
                <img src="/img/pencil-top.png" alt="" class="image-right-middle">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import {
    loadBlogIndexBgState,
    buildCustomBgLayerStyle,
    buildCustomBgOverlayStyle
} from '~/utils/blogIndexBg';
import { canManageBlogContent } from '~/utils/strapiUserRole';
import {
    BOOK_FONT_SIZE_OPTIONS,
    NOTEBOOK_BODY_MAX_CHARS,
    wrapTextareaSelection,
    wrapUnderline,
    wrapColor,
    wrapFontSize,
    wrapHtmlBold,
    wrapHtmlItalic,
    wrapHtmlLink,
    notebookHtmlToEditable,
    notebookEditableToHtml,
    notebookPlainLength,
    clampNotebookBodyText
} from '~/utils/contactBookFormat';

const index = useSearchStore();
const runtimeConfig = useRuntimeConfig();
const adminAllow = computed(() => ({
    emails: runtimeConfig.public.contentAdminEmails || '',
    usernames: runtimeConfig.public.contentAdminUsernames || ''
}));
const canManageContent = computed(() =>
    canManageBlogContent(index.userMe, adminAllow.value)
);
const notebookEditRef = ref(null);
const draftTextColor = ref('#8b4513');
const draftFontSize = ref('1em');
const notebookPlainLen = computed(() => notebookPlainLength(editingText.value));

const blogBgState = ref(null);

function loadBlogIndexBackground() {
    blogBgState.value = loadBlogIndexBgState();
}

const customBgLayerStyle = computed(() => buildCustomBgLayerStyle(blogBgState.value));
const customBgOverlayStyle = computed(() => buildCustomBgOverlayStyle(blogBgState.value));

const QUOTE_WAVE_LINES = [
    '"Мы все, как карандаши.',
    'Каждый рисует свою судьбу.',
    'Один ломается, другой тупит,',
    'а кто-то затачивается и движется вперёд."'
];
const AUTHOR_WAVE_TEXT = '— Светлана Кременецкая';

/** Сдвиг между соседними буквами (больше = медленнее) */
const WAVE_CHAR_STEP_S = 0.11;
/** Пауза в конце полного прохода, перед повтором */
const WAVE_CYCLE_PAUSE_S = 1.2;

function toWaveChars(text) {
    return [...String(text)].map((ch) => ({
        ch: ch === ' ' ? '\u00a0' : ch,
        space: ch === ' '
    }));
}

const quoteWaveLines = QUOTE_WAVE_LINES.map(toWaveChars);
const authorWaveChars = toWaveChars(AUTHOR_WAVE_TEXT);

/** Старт каждой строки = сразу после последней буквы предыдущей */
const waveLineStarts = (() => {
    const lengths = [
        ...quoteWaveLines.map((l) => l.length),
        authorWaveChars.length
    ];
    const starts = [];
    let t = 0;
    for (const len of lengths) {
        starts.push(t);
        t += Math.max(len, 1) * WAVE_CHAR_STEP_S;
    }
    return starts;
})();

const WAVE_CYCLE_S =
    waveLineStarts[waveLineStarts.length - 1] +
    authorWaveChars.length * WAVE_CHAR_STEP_S +
    WAVE_CYCLE_PAUSE_S;

function waveCharStyle(lineIdx, charIdx) {
    const delay = waveLineStarts[lineIdx] + charIdx * WAVE_CHAR_STEP_S;
    return {
        '--wave-delay': `${delay.toFixed(3)}s`,
        '--wave-duration': `${WAVE_CYCLE_S.toFixed(3)}s`
    };
}

const STORAGE_KEY = 'notebook-text-fixed-v3';

/* Переносы строк зафиксированы <br> — одинаковые на любом экране */
const defaultText = `<p>Всем привет!<br>
Будем знакомы, Меня зовут Алена.</p>
<p>В этом блоге я хочу рассказать<br>
про свой жизненный путь, с чего всё<br>
началось, поиски себя и своего места<br>
в жизни, и всё ли так просто, как кажется<br>
на первый взгляд.</p>
<p class="notebook-gap">&nbsp;</p>
<p>Надеюсь, моя история будет для кого-то<br>
полезной, как преодолеть трудности ,<br>
как не потерять себя и найти силы на<br>
что-то новое.</p>
<p class="notebook-gap">&nbsp;</p>
<p>Жизнь, мягко говоря, непредсказуема.<br>
В один момент все идет хорошо, а потом<br>
вдруг что-то происходит, и вся жизнь<br>
переворачивается с ног на голову,<br>
так случилось и у меня...</p>`;

const notebookText = ref(defaultText);
const isEditing = ref(false);
const editingText = ref('');

/** ≤900px: сначала лицевая (левая) страница, по тапу — правая с текстом */
const mobileNotebookOpen = ref(false);
const isMobileNotebook = ref(false);
let mobileNotebookMq = null;

function syncMobileNotebookMq() {
    if (typeof window === 'undefined') return;
    isMobileNotebook.value = mobileNotebookMq?.matches ?? false;
    if (!isMobileNotebook.value) {
        mobileNotebookOpen.value = false;
    }
}

function onNotebookTap(e) {
    if (!isMobileNotebook.value) return;
    const t = e?.target;
    if (t?.closest?.('.edit-controls, .textKra-editor, .notebook-fmt-toolbar, button, a, input, select, textarea')) {
        return;
    }
    /* открыто: тап по тексту не закрывает (можно читать/выделять) */
    if (mobileNotebookOpen.value && t?.closest?.('.textKra')) {
        return;
    }
    mobileNotebookOpen.value = !mobileNotebookOpen.value;
}

/** Старые сохранения с <h4> для приветствия → обычные <p>, чтобы вес шрифта совпадал у всех */
function normalizeNotebookHtml(html) {
    return String(html || '')
        .replace(/<h4([^>]*)>/gi, '<p$1>')
        .replace(/<\/h4>/gi, '</p>');
}

// Загрузка текста из localStorage
const loadText = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const normalized = normalizeNotebookHtml(saved);
            notebookText.value = normalized;
            if (normalized !== saved) {
                saveToStorage(normalized);
            }
        }
    }
};

// Сохранение текста в localStorage
const saveToStorage = (text) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, text);
    }
};

function onNotebookInput() {
    if (notebookPlainLength(editingText.value) > NOTEBOOK_BODY_MAX_CHARS) {
        editingText.value = clampNotebookBodyText(editingText.value);
    }
}

/** Esc / Ctrl+Enter; пробел и обычный Enter не трогаем */
function onNotebookKeydown(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
        return;
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveText();
    }
}

function applyNotebookFormat(kind) {
    const el = notebookEditRef.value;
    if (!el) return;
    const setValue = (next) => {
        editingText.value = clampNotebookBodyText(next);
    };
    if (kind === 'bold') {
        wrapTextareaSelection(el, wrapHtmlBold, setValue);
        return;
    }
    if (kind === 'italic') {
        wrapTextareaSelection(el, wrapHtmlItalic, setValue);
        return;
    }
    if (kind === 'underline') {
        wrapTextareaSelection(el, wrapUnderline, setValue);
        return;
    }
    if (kind === 'color') {
        wrapTextareaSelection(el, (sel) => wrapColor(sel, draftTextColor.value), setValue);
        return;
    }
    if (kind === 'size') {
        wrapTextareaSelection(el, (sel) => wrapFontSize(sel, draftFontSize.value), setValue);
        return;
    }
    if (kind === 'link') {
        const url = window.prompt('Адрес ссылки (https://…)', 'https://');
        if (!url || !String(url).trim()) return;
        wrapTextareaSelection(el, (sel) => wrapHtmlLink(sel, url), setValue);
    }
}

// Начать редактирование
const startEdit = () => {
    if (!canManageContent.value) return;
    if (isMobileNotebook.value) {
        mobileNotebookOpen.value = true;
    }
    // Абзацы → переносы, жирный/цвет/ссылки сохраняем как HTML-теги
    editingText.value = notebookHtmlToEditable(notebookText.value);
    isEditing.value = true;
    nextTick(() => {
        const textarea = notebookEditRef.value;
        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    });
};

// Сохранить изменения
const saveText = () => {
    if (!canManageContent.value) {
        cancelEdit();
        return;
    }
    if (!editingText.value.trim()) {
        notebookText.value = defaultText;
    } else {
        const clamped = clampNotebookBodyText(editingText.value);
        editingText.value = clamped;
        notebookText.value = notebookEditableToHtml(clamped) || defaultText;
    }

    saveToStorage(notebookText.value);
    isEditing.value = false;
};

// Отменить редактирование
const cancelEdit = () => {
    isEditing.value = false;
    editingText.value = '';
};

function onBlogIndexBgChanged() {
    loadBlogIndexBackground();
}

watch(canManageContent, (ok) => {
    if (!ok && isEditing.value) cancelEdit();
});

onMounted(async () => {
    loadText();
    loadBlogIndexBackground();
    try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('jwt')) {
            await index.fetchUserMe();
        }
    } catch {
        /* ignore */
    }
    if (typeof window !== 'undefined') {
        window.addEventListener('blog-index-bg-changed', onBlogIndexBgChanged);
        mobileNotebookMq = window.matchMedia('(max-width: 900px)');
        syncMobileNotebookMq();
        mobileNotebookMq.addEventListener('change', syncMobileNotebookMq);
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('blog-index-bg-changed', onBlogIndexBgChanged);
        mobileNotebookMq?.removeEventListener('change', syncMobileNotebookMq);
        mobileNotebookMq = null;
    }
});
</script>

<style scoped>
/* Позиции left/top/width/rotate — правь в media ниже */
.phoneMain {
    --chrome: 151px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100dvh - var(--chrome));
    max-width: 100%;
    box-sizing: border-box;
    background-image: url("/img/zebra-bg-stripes.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
}

.phoneMain--custom-bg {
    background-image: none !important;
}

.phoneMain-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
}

.phoneMain-bg-layer {
    position: absolute;
    inset: 0;
}

.phoneMain-bg-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

/*
 * Текст на правом листе — одни % и размер от ширины блокнота.
 * Переносы только через <br>, media не трогает.
 */
.textKra {
    position: absolute;
    top: 3%;
    right: 4%;
    left: calc(55% + 10px);
    bottom: 9%;
    color: rgb(10, 10, 10);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.9cqi;
    font-weight: 400;
    text-align: left;
    z-index: 10;
    padding: 1.1cqi 1.15cqi 1.5cqi;
    overflow: hidden;
    outline: none;
    line-height: 1.55;
    max-height: 100%;
    box-sizing: border-box;
    cursor: text;
    user-select: text;
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: normal;
    hyphens: none;
}

.textKra:focus {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(139, 120, 80, 0.2);
}

.textKra:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.textKra-editor {
    position: absolute;
    top: 3%;
    right: 4%;
    left: calc(55% + 10px);
    bottom: 9%;
    z-index: 30;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
    padding: 6px 8px 10px;
    background: rgba(255, 255, 255, 0.92);
    border: 2px solid rgba(139, 120, 80, 0.35);
    border-radius: 4px;
    pointer-events: auto;
}

.notebook-edit-meta {
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
}

.notebook-char-count {
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    color: rgba(74, 61, 50, 0.75);
}

.notebook-char-count--full {
    color: #b91c1c;
    font-weight: 600;
}

.notebook-fmt-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex-shrink: 0;
}

.notebook-fmt-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.75rem;
    height: 1.75rem;
    padding: 0 0.35rem;
    border: 1px solid rgba(160, 139, 106, 0.7);
    border-radius: 0.25rem;
    background: rgba(245, 239, 230, 0.95);
    color: #4a3d32;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 0.75rem;
    line-height: 1;
    cursor: pointer;
}

.notebook-fmt-btn:hover {
    background: #ebe4d8;
}

.notebook-fmt-select {
    height: 1.75rem;
    max-width: 7.5rem;
    padding: 0 0.35rem;
    border: 1px solid rgba(160, 139, 106, 0.7);
    border-radius: 0.25rem;
    background: rgba(245, 239, 230, 0.95);
    color: #4a3d32;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 0.7rem;
    line-height: 1;
    cursor: pointer;
}

.textKra-edit {
    position: relative;
    inset: auto;
    flex: 1;
    width: 100%;
    min-height: 0;
    margin: 0;
    padding: 10px 12px;
    resize: none;
    border: 1px solid rgba(139, 120, 80, 0.25);
    background: rgba(255, 253, 249, 0.98);
    border-radius: 4px;
    font-family: inherit;
    overflow: auto;
    cursor: text;
    white-space: pre-wrap;
    word-break: normal;
    overflow-wrap: break-word;
    user-select: text;
    -webkit-user-select: text;
    pointer-events: auto;
}

.textKra-edit:focus {
    outline: none;
    border-color: rgba(139, 120, 80, 0.6);
    box-shadow: 0 0 0 2px rgba(139, 120, 80, 0.12);
    background: #fffefb;
}

.textKra h4 {
    margin: 0 0 0.55em 0;
    font-size: 1em;
    font-weight: 400;
    line-height: inherit;
}

.textKra h4 + h4 {
    margin-top: 0.15em;
}

.textKra p {
    margin: 0 0 0.35em 0;
    text-indent: 0;
}

.textKra p:last-child {
    margin-bottom: 0;
}

.textKra p.notebook-gap {
    margin: 0.45em 0;
    min-height: 0.85em;
    line-height: 0.85em;
    text-indent: 0;
}

.textKra strong,
.textKra b {
    font-weight: 700;
}

.textKra em,
.textKra i {
    font-style: italic;
}

.textKra u {
    text-decoration: underline;
    text-underline-offset: 0.12em;
}

.textKra a {
    color: #6b5a3a;
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

.edit-controls {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 40;
    display: flex;
    gap: 8px;
}

.edit-btn,
.save-btn,
.cancel-btn {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(139, 120, 80, 0.4);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b5a3a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.edit-btn:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(139, 120, 80, 0.6);
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.save-btn {
    background: rgba(76, 175, 80, 0.9);
    border-color: rgba(76, 175, 80, 0.6);
    color: white;
}

.save-btn:hover {
    background: rgba(76, 175, 80, 1);
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
}

.cancel-btn {
    background: rgba(244, 67, 54, 0.9);
    border-color: rgba(244, 67, 54, 0.6);
    color: white;
}

.cancel-btn:hover {
    background: rgba(244, 67, 54, 1);
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(244, 67, 54, 0.3);
}

.edit-buttons {
    display: flex;
    gap: 8px;
}

.left-images,
.right-images,
.center-image {
    pointer-events: none;
}

/* ===== ДЕСКТОП как на скрине ===== */
.center-content {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 50%;
    max-width: 1041px;
    container-type: inline-size;
    container-name: notebook;
}

/*
 * Левые фото — внутри блокнота.
 * translateX(-66% + 20px): ~⅔ снаружи, ~⅓ под блокнотом.
 */
.left-images {
    position: absolute;
    left: 0;
    top: 50%;
    width: 36%;
    transform: translate(calc(-66% + 20px), -50%);
    z-index: 0;
}

.left-images img {
    width: 100%;
    height: auto;
    margin-bottom: 4%;
    display: block;
}

/* поворот левых фото — крути здесь */
.image-left-top {
    transform: rotate(-6deg);
}

.image-left-bottom {
    transform: rotate(-4deg);
}

.notebook-back-btn {
    display: none;
}

.notebook-clip {
    position: relative;
    z-index: 1;
    width: 100%;
    overflow: visible;
}

.center-image {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    max-width: 1041px;
    aspect-ratio: 1041 / 708;
    height: auto;
    object-fit: contain;
    margin: 0 auto;
}

.quote-container {
    position: absolute;
    left: calc(62% - 80px);
    top: 100%;
    transform: translate(-70%, -1.35rem);
    max-width: 420px;
    width: 42%;
    white-space: initial;
    pointer-events: none;
    text-align: left;
}

.quote {
    margin: 0;
    font-size: clamp(0.72rem, 1.35vw, 1rem);
    font-style: italic;
    font-weight: 700;
    color: #000000;
    line-height: 1.65;
    text-shadow:
        2px 2px 4px rgba(255, 255, 255, 1),
        0 0 10px rgba(255, 255, 255, 0.9),
        0 0 20px rgba(255, 255, 255, 0.7),
        -1px -1px 2px rgba(255, 255, 255, 0.8);
    -webkit-text-stroke: 0.3px rgba(255, 255, 255, 0.5);
}

.quote-line {
    display: block;
    white-space: nowrap;
}

.author {
    font-size: clamp(0.65rem, 1.15vw, 0.95rem);
    font-weight: 600;
    color: #0a0a0a;
    margin-top: 0.7vw;
    white-space: nowrap;
    text-shadow:
        1px 1px 3px rgba(255, 255, 255, 1),
        0 0 8px rgba(255, 255, 255, 0.9),
        0 0 15px rgba(255, 255, 255, 0.7),
        -1px -1px 1px rgba(255, 255, 255, 0.8);
    -webkit-text-stroke: 0.2px rgba(255, 255, 255, 0.5);
}

.quote-char {
    display: inline-block;
    animation-name: quoteCharWave;
    animation-duration: var(--wave-duration, 14s);
    animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
    animation-iteration-count: infinite;
    animation-delay: var(--wave-delay, 0s);
    will-change: transform;
}

.quote-char--space {
    width: 0.28em;
}

@keyframes quoteCharWave {
    0%,
    100% {
        transform: translateY(0);
    }
    1.8% {
        transform: translateY(-0.22em);
    }
    3.6% {
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .quote-char {
        animation: none;
    }
}

/* карандаши — правый нижний угол блокнота */
.right-images {
    position: absolute;
    right: 1%;
    top: calc(100% + 6px);
    width: clamp(28px, 2.6vw, 40px);
    height: clamp(34px, 4.2vw, 48px);
    z-index: 4;
    pointer-events: none;
    /* +50% своей высоты вниз */
    translate: 50px 110%;
}

.right-images > img {
    position: absolute;
    width: auto;
    height: auto;
    max-width: none;
    filter: drop-shadow(0 8px 14px rgba(40, 28, 12, 0.22));
    transform-origin: center center;
}

/* повороты карандашей — крути transform: rotate(...) */
.image-right-bottom {
    width: 58%;
    left: 2%;
    bottom: 6%;
    z-index: 1;
    transform: rotate(-18deg);
    animation: rightDecorDrift 7s ease-in-out infinite;
}

.image-right-middle {
    width: 70%;
    right: -4%;
    bottom: 14%;
    z-index: 2;
    transform: rotate(32deg);
    animation: rightDecorDrift 8s ease-in-out infinite 0.35s;
}

.image-right-top {
    width: 76%;
    right: 10%;
    bottom: 34%;
    z-index: 3;
    transform: rotate(-22deg);
    animation: rightDecorDrift 6.5s ease-in-out infinite 0.7s;
}

@keyframes rightDecorDrift {
    0%,
    100% {
        translate: 0 0;
    }
    50% {
        translate: 0 -6px;
    }
}

/*
 * MEDIA — один и тот же открытый блокнот (notebook-zebra)
 * на всех экранах. Крути left / top / width / rotate сама.
 */

@media (max-width: 1400px) {
    .center-content {
        width: 55%;
        top: 46%;
    }

    .quote-container {
        left: calc(58% - 80px);
        width: 40%;
        transform: translate(-55%, -1.2rem);
    }
}

@media (max-width: 1200px) {
    .phoneMain {
        background-image: url(/img/zebra-stripes-1536.png);
    }

    .center-content {
        left: 50%;
        top: 47%;
        width: 64%;
    }

    .left-images {
        width: 34%;
    }

    .quote-container {
        left: calc(55% - 80px);
        width: 44%;
        transform: translate(-50%, -1.1rem);
    }

    .right-images {
        right: 0;
        top: calc(100% + 4px);
        width: clamp(24px, 2.4vw, 34px);
        height: clamp(30px, 3.8vw, 42px);
        translate: 30px 110%;
    }
}

@media (max-width: 1024px) {
    .phoneMain {
        background-image: url(/img/stripes-1024.png);
        background-size: cover;
    }

    .center-content {
        left: 52%;
        top: 45%;
        width: 72%;
    }

    .left-images {
        width: 34%;
        /* overlap: правь -66% (⅓ под блокнотом) */
        transform: translate(calc(-66% + 20px), -50%);
    }

    .quote-container {
        left: calc(58% - 80px);
        width: 48%;
        max-width: none;
        transform: translate(-55%, -1rem);
    }

    .quote {
        font-size: clamp(0.65rem, 1.4vw, 0.85rem);
    }

    .author {
        font-size: clamp(0.6rem, 1.2vw, 0.8rem);
    }

    .quote-line {
        white-space: nowrap;
    }

    .right-images {
        right: -2%;
        top: calc(100% + 2px);
        width: clamp(20px, 2.8vw, 30px);
        height: clamp(26px, 4vw, 38px);
        translate: 20px 110%;
    }

    .edit-controls {
        top: 1.5%;
        right: 2%;
    }

    .edit-btn,
    .save-btn,
    .cancel-btn {
        width: 30px;
        height: 30px;
    }

    .edit-btn svg,
    .save-btn svg,
    .cancel-btn svg {
        width: 16px;
        height: 16px;
    }
}

@media (max-width: 768px) {
    .phoneMain {
        background-image: url(/img/stripes-phone.png);
        background-size: cover;
    }

    .center-content {
        left: 54%;
        top: 44%;
        width: 82%;
    }

    .left-images {
        width: 32%;
        transform: translate(calc(-66% + 20px), -50%);
    }

    .quote-container {
        left: calc(55% - 60px);
        width: 55%;
        transform: translate(-50%, -0.85rem);
    }

    .quote {
        font-size: clamp(0.55rem, 1.8vw, 0.75rem);
    }

    .author {
        font-size: clamp(0.5rem, 1.5vw, 0.7rem);
        margin-top: 0.35rem;
    }

    .right-images {
        width: clamp(16px, 3vw, 24px);
        height: clamp(20px, 4vw, 30px);
        translate: 12px 110%;
    }
}

/*
 * ≤900px: лицевая = левая страница разворота.
 * Тап → сдвиг на правую страницу + текст.
 */
@media (max-width: 900px) {
    .center-content {
        left: 50%;
        top: 46%;
        /* фиксированный размер — не сжимается при сужении окна */
        width: 360px;
        min-width: 360px;
        max-width: 360px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }

    .left-images,
    .quote-container,
    .right-images {
        display: none;
    }

    .notebook-clip {
        overflow: hidden;
        width: 360px;
        min-width: 360px;
        border-radius: 2px;
    }

    .center-image {
        width: 720px;
        min-width: 720px;
        max-width: none;
        aspect-ratio: 1041 / 708;
        height: auto;
        margin: 0;
        transform: translateX(0);
        transition: transform 0.45s ease;
        will-change: transform;
    }

    .center-content--page-open .center-image {
        transform: translateX(-50%);
    }

    .textKra,
    .textKra-editor {
        left: 10%;
        right: 7%;
        top: 4%;
        bottom: 8%;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.35s ease 0.1s;
        font-size: clamp(11px, 4.6cqi, 15px);
        padding: 2cqi;
    }

    .center-content--page-open .textKra,
    .center-content--page-open .textKra-editor {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    /* подсказка: лицевая / назад */
    .center-content::after {
        content: 'Нажми';
        position: absolute;
        left: 60%;
        right: auto;
        bottom: 8%;
        transform: translateX(-50%);
        z-index: 5;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.88);
        color: #4a3d32;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .center-content--page-open::after {
        display: none;
    }

    .notebook-back-btn {
        display: block;
        position: absolute;
        top: 5%;
        right: 5%;
        z-index: 30;
        padding: 0.35rem 0.75rem;
        border: none;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        color: #4a3d32;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .edit-controls {
        top: 2%;
        right: 4%;
    }
}
</style>

