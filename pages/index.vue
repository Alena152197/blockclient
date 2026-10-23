<template>
    <div class="phoneMain" :class="{ 'phoneMain--custom-bg': blogBgState?.url }">
        <div v-if="blogBgState?.url" class="phoneMain-bg" aria-hidden="true">
            <div class="phoneMain-bg-layer" :style="customBgLayerStyle" />
            <div class="phoneMain-bg-overlay" :style="customBgOverlayStyle" />
        </div>
        <!-- Левая часть -->
        <div class="left-images">
            <img src="/img/notebook-sea.png" alt="Картинка 1" class="image-left-top">
            <img src="/img/notebook-mountains.png" alt="Картинка 2" class="image-left-bottom">
        </div>
        <!-- Центральная часть -->
        <div class="center-content" v-if="index.config.primeryBlock">
            <img src="/img/notebook-zebra.png" alt="Картинка 3" class="center-image">
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
            <div v-if="canManageContent" class="edit-controls">
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
                <img src="/img/notebook-zebra-1024.png" alt="" class="imageRightBlock">
                <img src="/img/notebook-zebra-768.png" alt="" class="imageRightNone">
                <img src="/img/swirl-large-phone.png" alt="" class="topKara">
                <img src="/img/swirl-top.png" alt="" class="nizKara">
                <img src="/img/swirl-bottom.png" alt="" class="tocKara">
                <img src="/img/graphite-phone-alt.png" alt="" class="grafKara">
                <img src="/img/sharpener-phone.png" alt="" class="phoneToc">
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

const STORAGE_KEY = 'notebook-text';

const defaultText = `<h4>Всем привет! <br>
Будем знакомы, Меня зовут Алена.</h4>
<p>В этом блоге я хочу рассказать
про свой жизненный путь, с чего всё
началось, поиски себя и своего места
в жизни, и всё ли так просто, как кажется
на первый взгляд. <br><br>
Надеюсь, моя история будет для кого-то
полезной, как преодолеть трудности ,
как не потерять себя и найти силы на
что-то новое. <br><br>
Жизнь, мягко говоря, непредсказуема.
В один момент все идет хорошо, а потом
вдруг что-то происходит, и вся жизнь
переворачивается с ног на голову,
так случилось и у меня...</p>`;

const notebookText = ref(defaultText);
const isEditing = ref(false);
const editingText = ref('');

// Загрузка текста из localStorage
const loadText = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            notebookText.value = saved;
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
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('blog-index-bg-changed', onBlogIndexBgChanged);
    }
});
</script>

<style scoped>
.phoneMain {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 151px);
    width: 100vw;
    max-width: 100vw;
    background-image: url("/img/zebra-bg-stripes.png");
    background-size: 100% 110%;
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

.textKra {
    position: absolute;
    top: 2.5%;
    right: 3%;
    left: 56%;
    bottom: 8%;
    color: rgb(10, 10, 10);
    font-size: clamp(11px, 1.1vw, 15px);
    text-align: left;
    z-index: 10;
    padding: 10px 12px 16px;
    overflow: hidden;
    outline: none;
    word-wrap: break-word;
    line-height: 1.55;
    max-height: 100%;
    box-sizing: border-box;
    cursor: text;
    user-select: text;
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
    top: 2.5%;
    right: 3%;
    left: 56%;
    bottom: 8%;
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
    margin: 0 0 0.35em 0;
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.35;
}

.textKra h4 + h4 {
    margin-top: 0.15em;
}

.textKra p {
    margin: 0 0 0.55em 0;
    text-indent: 0;
}

.textKra p:last-child {
    margin-bottom: 0;
}

/* Пустая строка в редакторе → компактный разрыв (пробел между абзацами) */
.textKra p.notebook-gap {
    margin: 0.2em 0;
    min-height: 0.65em;
    line-height: 0.65em;
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
.center-content {
    position: absolute;
    z-index: 1;
}

/* Декор не перехватывает мышь — иначе нельзя выделить текст в блокноте */
.left-images,
.right-images,
.center-image {
    pointer-events: none;
}

.center-content {
    z-index: 2;
}

.left-images {
    left: 24%;
    top: 46%;
    transform: translate(-130px, -50%);
    width: 19%;
}

.left-images img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}

.center-content {
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 50%;
    max-width: 1041px;
}

.center-image {
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
    left: 62%;
    transform: translate(-70%, -15%);
    max-width: 420px;
    white-space: initial;
    pointer-events: none;
}

.quote {
    margin: 0;
    font-size: clamp(1rem, 1vw, 1rem);
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
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    font-weight: 600;
    color: #0a0a0a;
    margin-top: 12px;
    white-space: nowrap;
    text-shadow: 
        1px 1px 3px rgba(255, 255, 255, 1),
        0 0 8px rgba(255, 255, 255, 0.9),
        0 0 15px rgba(255, 255, 255, 0.7),
        -1px -1px 1px rgba(255, 255, 255, 0.8);
    -webkit-text-stroke: 0.2px rgba(255, 255, 255, 0.5);
}

/* Волна по буквам: строка за строкой, общий цикл */
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

/* Мягкий длинный подъём; очередь строк — через delay */
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

/* Правый декор: у нижнего правого угла блокнота, чуть ниже края */
.right-images {
    position: absolute;
    right: 1%;
    top: calc(100% + 6px);
    left: auto;
    bottom: auto;
    width: clamp(80px, 7.5vw, 115px);
    height: clamp(95px, 12vw, 140px);
    z-index: 4;
    pointer-events: none;
    translate: 50px 0px;
}

.right-images > img {
    position: absolute;
    width: auto;
    height: auto;
    max-width: none;
    filter: drop-shadow(0 8px 14px rgba(40, 28, 12, 0.22));
    transform-origin: center center;
}

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

.imageRightBlock {
    display: none;
}

.imageRightNone {
    display: none;
    overflow: hidden;
}

.grafKara,
.topKara,
.nizKara,
.tocKara,
.phoneToc {
    display: none;
}

@media (max-width: 1600px) {
    .quote-container {
        bottom: -32%;
        transform: translate(-50%, -50%);
    }

    .quote {
        font-size: clamp(0.9rem, 1vw, 0.9rem);
    }

    .author {
        font-size: clamp(0.7rem, 1.5vw, 0.8rem);
    }

    .textKra {
        font-size: clamp(11px, 1.1vw, 15px);
        padding: 18px 12px;
    }
}

@media (max-width: 1500px) {
    .phoneMain {
        background-image: url(/img/zebra-stripes-1536.png);
    }

    .left-images {
        left: 13%;
        top: 53%;
    }

    .center-content {
        left: 50%;
        top: 51%;
        width: 58%;
    }

    .quote-container {
        bottom: -31%;
    }

    .textKra {
        font-size: clamp(11px, 1.1vw, 14px);
        padding: 18px 12px;
    }
}

/* ~1500px: левые картинки на 150px вправо (не для более узких) */
@media (max-width: 1500px) and (min-width: 1321px) {
    .left-images {
        transform: translate(10px, -50%);
    }
}

@media (max-width: 1320px) {
    .left-images {
        transform: translateY(-50%);
    }

    .quote-container {
        bottom: -43%;
    }

    .right-images {
        right: 0;
        top: calc(100% + 4px);
        width: clamp(75px, 7vw, 100px);
        height: clamp(90px, 11vw, 120px);
    }

    .textKra {
        font-size: clamp(10px, 1vw, 13px);
        padding: 15px 10px;
    }
}

@media (max-width: 1200px) {
    .center-content {
        left: 48%;
        top: 50%;
        width: 70%;
    }

    .left-images {
        left: 3%;
        top: 59%;
        scale: 1.2;
    }

    .quote-container {
        bottom: -38%;
        left: 50%;
    }

    .right-images {
        right: -1%;
        top: calc(100% + 2px);
        width: clamp(70px, 7.5vw, 95px);
        height: clamp(85px, 10vw, 115px);
    }
}

@media (max-width: 1024px) {
    .left-images {
        left: 18%;
        top: 55%;
        scale: 1.3;
    }

    .center-content {
        left: 50%;
        top: 43%;
        width: 40%;
        z-index: 3;
    }

    .center-image {
        content: url("/img/notebook-phone.png");
        max-width: 315px;
        aspect-ratio: 315 / 415;
    }

    .phoneMain {
        background-image: url(/img/stripes-1024.png);
        background-size: cover;
    }

    .quote-container {
        bottom: -14rem;
        left: 92%;
        transform: translateX(-50%);
        width: 300px;
        text-align: center;
    }

    .quote {
        font-size: 14px;
        color: #b0b3b0;
    }

    .author {
        font-size: clamp(0.7rem, 1.2vw, 0.8rem);
    }

    .right-images {
        right: -4%;
        top: calc(100% + 8px);
        width: 70px;
        height: 88px;
    }

    .imageRightBlock {
        display: none;
    }

    .textKra {
        font-size: clamp(10px, 1vw, 14px);
        padding: 15px 10px;
        right: 3%;
        left: 56%;
    }

    .textKra-editor {
        right: 3%;
        left: 56%;
    }
}

@media (max-width: 875px) {
    .quote-container {
        bottom: -16rem;
        left: 80%;
        transform: translateX(-50%);
        width: 300px;
        text-align: center;
    }

    .imageRightNone {
        display: none;
    }

    .right-images {
        width: 64px;
        height: 80px;
        right: -2%;
        top: calc(100% + 6px);
    }

    .textKra {
        font-size: clamp(9px, 0.9vw, 12px);
        padding: 12px 8px;
    }
}

@media (max-width: 768px) {
    .imageRightBlock {
        display: none;
    }

    .imageRightNone {
        display: block;
        position: absolute;
        bottom: 46rem;
        left: -40px;
        scale: 4;
        z-index: 5;
    }

    .left-images {
        left: 13%;
        top: 55%;
        scale: 1.6;
    }

    .center-content {
        left: 50%;
        top: 43%;
        width: 50%;
        z-index: 3;
    }

    .center-image {
        content: url("/img/notebook-phone.png");
        max-width: 315px;
        aspect-ratio: 315 / 415;
    }

    .phoneMain {
        background-image: url(/img/stripes-phone.png);
        background-size: cover;
    }

    .quote-container {
        bottom: -14rem;
        left: 93%;
        transform: translateX(-50%);
        width: 280px;
        text-align: right;
    }

    .quote {
        font-size: clamp(0.9rem, 1.5vw, 1rem);
        color: #d3cbcb;
    }

    .author {
        font-size: clamp(0.8rem, 1.2vw, 0.8rem);
    }

    .image-right-middle,
    .image-right-top,
    .image-right-bottom {
        display: none;
    }

    .left-images img {
        transform: rotate(-20deg);
    }

    .right-images {
        right: -6%;
        top: calc(100% + 10px);
        width: min(26vw, 95px);
        height: min(22vw, 85px);
    }

    .grafKara,
    .topKara,
    .nizKara,
    .tocKara,
    .phoneToc {
        display: block;
        position: absolute;
        filter: drop-shadow(0 6px 10px rgba(40, 28, 12, 0.2));
        animation: rightDecorDrift 7s ease-in-out infinite;
    }

    .grafKara {
        width: 70%;
        left: 8%;
        bottom: 4%;
        z-index: 1;
        opacity: 0.9;
        animation-delay: 0.2s;
    }

    .topKara {
        width: 48%;
        left: 0;
        bottom: 18%;
        z-index: 2;
        transform: rotate(-20deg);
        animation-delay: 0.5s;
    }

    .nizKara {
        width: 36%;
        right: 6%;
        bottom: 8%;
        z-index: 2;
        transform: rotate(12deg);
        animation-delay: 0.8s;
    }

    .tocKara {
        width: 34%;
        right: 18%;
        bottom: 42%;
        z-index: 2;
        transform: rotate(-8deg);
        animation-delay: 1s;
    }

    .phoneToc {
        width: 42%;
        right: 2%;
        bottom: 28%;
        z-index: 3;
        transform: rotate(18deg);
        animation-delay: 0.35s;
    }

    .textKra {
        font-size: clamp(10px, 1vw, 13px);
        padding: 12px 8px;
    }
}

@media (max-width: 650px) {
    .imageRightNone {
        bottom: 48rem;
        left: 1rem;
        scale: 5;
    }

    .left-images {
        left: 8%;
        top: 55%;
        scale: 1.8;
    }

    .center-content {
        left: 50%;
        top: 43%;
        width: 65%;
    }

    .quote-container {
        bottom: -13rem;
        left: 75%;
        transform: translateX(-50%);
        width: 280px;
        text-align: right;
    }

    .right-images {
        width: min(28vw, 90px);
        height: min(24vw, 80px);
        right: -4%;
        top: calc(100% + 8px);
    }

    .textKra {
        font-size: clamp(10px, 1vw, 14px);
        padding: 10px 6px;
    }
}

@media (max-width: 550px) {
    .imageRightNone {
        bottom: 48rem;
        left: 4rem;
        scale: 6;
    }

    .left-images {
        left: 8%;
        top: 58%;
        scale: 2.2;
    }

    .center-content {
        left: 50%;
        top: 40%;
        width: 75%;
    }

    .quote-container {
        bottom: -14rem;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        text-align: right;
    }

    .quote {
        font-size: 14px;
    }

    .author {
        font-size: 14px;
    }

    .grafKara,
    .topKara,
    .nizKara,
    .tocKara,
    .phoneToc {
        display: none;
    }

    .right-images {
        display: none;
    }

    .textKra {
        font-size: clamp(9px, 0.9vw, 12px);
        padding: 10px 6px;
        text-align: left;
    }
}

@media (max-width: 430px) {
    .imageRightNone {
        bottom: 47rem;
        left: 3rem;
        scale: 7.5;
    }

    .left-images {
        left: 8%;
        top: 60%;
        scale: 2.5;
    }

    .center-content {
        left: 50%;
        top: 38%;
        width: 82%;
    }

    .quote-container {
        bottom: -15rem;
        left: 47%;
        transform: translateX(-50%);
        width: 250px;
        text-align: right;
    }

    .quote {
        font-size: 12px;
    }

    .author {
        font-size: 12px;
    }

    .textKra {
        font-size: clamp(8px, 0.8vw, 10px);
        padding: 8px 5px;
        text-align: left;
    }

    .edit-controls {
        top: 1%;
        right: 1%;
    }

    .edit-btn,
    .save-btn,
    .cancel-btn {
        width: 32px;
        height: 32px;
    }
}

@media (max-width: 768px) {
    .edit-controls {
        top: 1%;
        right: 1%;
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
</style>

