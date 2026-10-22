<template>
    <div
        class="contact-page-root relative flex min-h-0 w-full flex-1 flex-col bg-right bg-no-repeat bg-[length:83%_100%] bg-[url('/img/zebra-bg.png')]"
        :class="{ 'contact-page--custom-bg': contactBgState?.url }"
    >
        <div v-if="contactBgState?.url" class="contact-page-bg" aria-hidden="true">
            <div class="contact-page-bg-layer" :style="customContactBgLayerStyle" />
            <div class="contact-page-bg-overlay" :style="customContactBgOverlayStyle" />
        </div>
        <div class="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-2 py-6">
            <h2
                v-if="spreadTitle"
                class="max-w-[min(100vw,890px)] px-2 text-center font-serif text-xl font-semibold tracking-wide text-[#3d3428] md:text-2xl"
            >
                {{ spreadTitle }}
            </h2>
            <!-- Контейнер разворота: нитки позиционируются от его границ (иначе «уезжают» вверх относительно книги) -->
            <div class="book-spread-wrap relative inline-flex max-w-[100vw] flex-row flex-nowrap items-stretch justify-center">
                <div class="pointer-events-none absolute inset-0 -z-[1] hidden lg:flex" aria-hidden="true">
                    <div
                        class="relative h-[598px] w-[445px] md:h-[520px] md:w-[380px] sm:h-[440px] sm:w-[320px] max-[480px]:h-[380px] max-[480px]:w-[280px] lg:h-[598px] lg:w-[445px]"
                    >
                        <img src="/img/sheet-1.png" alt="" class="relative h-full w-full object-cover" />
                    </div>
                    <div
                        class="relative h-[598px] w-[445px] md:h-[520px] md:w-[380px] sm:h-[440px] sm:w-[320px] max-[480px]:h-[380px] max-[480px]:w-[280px] lg:h-[598px] lg:w-[445px]"
                    >
                        <img src="/img/sheet-2.png" alt="" class="relative h-full w-full object-cover" />
                    </div>
                </div>

            <!-- Левая страница: фото (соседний лист — текст справа) -->
            <div
                :class="[
                    'book-left relative z-[1] h-[598px] w-[445px] md:h-[520px] md:w-[380px] sm:h-[440px] sm:w-[320px] max-[480px]:h-[380px] max-[480px]:w-[280px] lg:h-[598px] lg:w-[445px]',
                    'drop-shadow-[10px_15px_25px_rgba(0,0,0,0.4)] drop-shadow-[5px_8px_15px_rgba(0,0,0,0.3)]',
                    { pageFlipPrew: pageFlipLeft },
                    leftClass
                ]"
            >
                <img src="/img/sheet-1.png" alt="" class="page-bg relative h-full w-full object-cover" />
                <div
                    class="book-spine absolute bottom-0 right-[-4px] top-0 z-[10] w-2 rounded-r-sm bg-gradient-to-b from-[#8b7850] via-[#6b5a3a] via-[#5a4a2a] via-[#6b5a3a] to-[#8b7850] shadow-[inset_-2px_0_8px_rgba(0,0,0,0.4),inset_2px_0_8px_rgba(0,0,0,0.4),0_0_15px_rgba(0,0,0,0.3)]"
                />
                <div
                    class="book-text-content absolute left-0 top-0 z-[5] box-border h-full w-full overflow-hidden bg-[rgba(255,252,248,0.85)] p-6 md:p-7 sm:p-5 max-[480px]:p-4 md:pl-[28px] md:pr-[30px] md:pt-[28px] md:pb-[28px] sm:pl-[26px] sm:pr-[28px] sm:pt-[26px] sm:pb-[26px] lg:p-8"
                >
                    <div v-if="spread.imageUrl" class="book-photo-frame h-full min-h-0 w-full">
                        <img :src="spread.imageUrl" alt="" class="h-full w-full rounded-sm object-cover shadow-inner" />
                    </div>
                    <div
                        v-else
                        class="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 px-3 text-center text-[13px] italic leading-snug text-[#6b5a4a]/75 md:text-[14px]"
                    >
                        <span>Здесь фото разворота.</span>
                        <span class="text-[11px] not-italic text-[#8b7355]/80">
                            В Strapi — поле картинки у записи «О себе», либо в начале текста строка
                            <code class="rounded bg-black/5 px-1 font-mono text-[10px]">![](/uploads/…)</code>
                        </span>
                    </div>
                </div>
            </div>

                <!-- Шнурки строго по центру разворота (переплёт), top в % высоты книги -->
                <div
                    class="pointer-events-none absolute inset-0 z-[15] overflow-visible"
                    aria-hidden="true"
                >
                    <div
                        v-for="n in 21"
                        :key="n"
                        class="book-thread absolute left-1/2 h-[6px] w-[24px] -translate-x-1/2 -translate-y-1/2"
                        :style="{ top: bookThreadTop(n) }"
                    />
                </div>

            <!-- Правая страница: текст разворота -->
            <div
                :class="[
                    'book-right relative z-[1] h-[598px] w-[445px] md:h-[520px] md:w-[380px] sm:h-[440px] sm:w-[320px] max-[480px]:h-[380px] max-[480px]:w-[280px] lg:h-[598px] lg:w-[445px]',
                    'drop-shadow-[10px_15px_25px_rgba(0,0,0,0.4)] drop-shadow-[5px_8px_15px_rgba(0,0,0,0.3)]',
                    { pageFlip: pageFlipRight }
                ]"
            >
                <img src="/img/sheet-2.png" alt="" class="page-bg relative h-full w-full object-cover" />
                <div
                    class="book-spine absolute bottom-0 left-[-4px] top-0 z-[10] w-2 rounded-l-sm bg-gradient-to-b from-[#8b7850] via-[#6b5a3a] via-[#5a4a2a] via-[#6b5a3a] to-[#8b7850] shadow-[inset_-2px_0_8px_rgba(0,0,0,0.4),inset_2px_0_8px_rgba(0,0,0,0.4),0_0_15px_rgba(0,0,0,0.3)]"
                />
                <div
                    class="book-text-content absolute left-0 top-0 z-[5] box-border h-full w-full overflow-y-auto overflow-x-hidden bg-[rgba(255,252,248,0.7)] p-32 md:p-[28px_30px] sm:p-[26px_28px] max-[480px]:p-[24px_26px]"
                >
                    <div
                        class="book-text block h-full min-h-0 w-full max-w-full break-words rounded-sm font-serif text-[17px] leading-[1.7] tracking-[0.3px] text-justify text-[#1f1f1f] [word-spacing:0.1em] transition-colors duration-300 md:text-[15px] md:leading-[1.65] sm:text-[14px] sm:leading-[1.5] sm:tracking-[0.2px] max-[480px]:text-[13px] max-[480px]:leading-[1.4]"
                        style="text-shadow: 0.3px 0.3px 0.5px rgba(255, 255, 255, 0.9), 0.1px 0.1px 0.2px rgba(0, 0, 0, 0.05)"
                        v-html="textHtml"
                    />
                </div>
            </div>
            </div>

            <div v-if="canEditAbout" class="flex justify-center px-2">
                <button
                    type="button"
                    class="rounded-md border border-[#a08b6a] bg-[#f5efe6] px-4 py-2 text-sm font-medium text-[#4a3d32] shadow-sm hover:bg-[#ebe4d8]"
                    @click="bookEditorOpen = true"
                >
                    Редактировать этот разворот
                </button>
            </div>

            <ContactBookEditor v-model="bookEditorOpen" :entry="currentEntry" @saved="fetchSpread" />

            <div class="relative flex flex-wrap items-center justify-center gap-4 pb-1 pt-1">
                <button
                    type="button"
                    class="size-12 hover:text-red-600 active:text-black disabled:opacity-40"
                    :disabled="currentPage <= 1"
                    aria-label="Предыдущий разворот"
                    @click="prevPage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path
                            d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM6.34277 11.9996L12.2925 6.0498V10.9996H17.6565V12.9996H12.2925V17.9493L6.34277 11.9996Z"
                        />
                    </svg>
                </button>
                <span class="select-none text-sm tabular-nums text-[#5a4a3a]">{{ currentPage }} / {{ totalPages || 1 }}</span>
                <button
                    type="button"
                    class="size-12 hover:text-red-600 active:text-black disabled:opacity-40"
                    :disabled="currentPage >= totalPages"
                    aria-label="Следующий разворот"
                    @click="nextPage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path
                            d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM17.6575 11.9996L11.7077 17.9493V12.9996H6.34375V10.9996H11.7077V6.0498L17.6575 11.9996Z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useSearchStore } from '~/stores/search';
import { canManageBlogContent } from '~/utils/strapiUserRole';
import MarkdownIt from 'markdown-it';
import {
    loadPageBgState,
    buildCustomBgLayerStyle,
    buildCustomBgOverlayStyle
} from '~/utils/blogIndexBg';
import { spreadFromAboutEntry } from '~/utils/contactBookSpread';
import { STRAPI_BASE } from '~/utils/strapiBase';
import { BOOK_THREAD_TOP_PERCENT } from '~/utils/contactBookThreads';

const contactBgState = ref(null);

function loadContactBackground() {
    contactBgState.value = loadPageBgState('contact');
}

const customContactBgLayerStyle = computed(() => buildCustomBgLayerStyle(contactBgState.value));
const customContactBgOverlayStyle = computed(() => buildCustomBgOverlayStyle(contactBgState.value));

function onContactPageBgChanged() {
    loadContactBackground();
}

const search = useSearchStore();
const bookEditorOpen = ref(false);
const canEditAbout = computed(
    () => canManageBlogContent(search.userMe) && currentEntry.value != null
);

const pageFlipRight = ref(false);
const pageFlipLeft = ref(false);
const currentEntry = ref(null);
const currentPage = ref(1);
const pageSize = 1;
const totalPages = ref(1);
const markdown = new MarkdownIt();
const leftClass = ref('');

const spread = computed(() => spreadFromAboutEntry(currentEntry.value));

const spreadTitle = computed(() => {
    const t = spread.value?.title;
    return typeof t === 'string' && t.trim() ? t.trim() : '';
});

const textHtml = computed(() => {
    const md = spread.value.textMarkdown;
    if (!md || !String(md).trim()) return '';
    return markdown.render(md);
});

/** 21 нитки — top в % высоты разворота, совпадает с дырками на PNG (см. contactBookThreads.js) */
function bookThreadTop(index) {
    const pct = BOOK_THREAD_TOP_PERCENT[index - 1];
    return pct != null ? `${pct}%` : '50%';
}

const fetchSpread = async () => {
    try {
        const url = `${STRAPI_BASE}/api/abouts?populate=*&sort=createdAt:asc&pagination[page]=${currentPage.value}&pagination[pageSize]=${pageSize}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const list = Array.isArray(data.data) ? data.data : [];
        currentEntry.value = list[0] ?? null;
        const meta = data.meta?.pagination;
        if (meta && typeof meta.pageCount === 'number') {
            totalPages.value = Math.max(1, meta.pageCount);
        } else if (meta && typeof meta.total === 'number') {
            totalPages.value = Math.max(1, Math.ceil(meta.total / pageSize));
        } else {
            totalPages.value = list.length ? 1 : 1;
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        currentEntry.value = null;
    }
};

const flip = (direction) => {
    if (direction === 'next') {
        pageFlipRight.value = true;
        setTimeout(() => {
            pageFlipRight.value = false;
            leftClass.value = '';
        }, 1000);
    }
    if (direction === 'prev') {
        pageFlipLeft.value = true;
        leftClass.value = 'z-10';
        setTimeout(() => {
            pageFlipLeft.value = false;
            leftClass.value = '';
        }, 1000);
    }
};

const nextPage = async () => {
    if (currentPage.value >= totalPages.value) return;
    currentPage.value += 1;
    await fetchSpread();
    flip('next');
};

const prevPage = async () => {
    if (currentPage.value <= 1) return;
    currentPage.value -= 1;
    await fetchSpread();
    flip('prev');
};

function onKeydown(e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextPage();
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
    }
}

onMounted(async () => {
    await fetchSpread();
    if (!process.client) return;
    try {
        if (localStorage.getItem('jwt') && !search.userMe?.id) {
            await search.fetchUserMe();
        }
    } catch {
        /* ignore */
    }
    loadContactBackground();
    window.addEventListener('contact-page-bg-changed', onContactPageBgChanged);
    window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('contact-page-bg-changed', onContactPageBgChanged);
        window.removeEventListener('keydown', onKeydown);
    }
});
</script>

<style scoped>
.contact-page-root {
    position: relative;
}

.contact-page--custom-bg {
    background-image: none !important;
}

.contact-page-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
}

/* Подложка под режим contain: поля не просвечивают жёлтый main */
.contact-page--custom-bg .contact-page-bg {
    background-color: #141414;
}

.contact-page-bg-layer {
    position: absolute;
    inset: 0;
}

.contact-page-bg-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

/* Псевдоэлементы для страниц книги - граница страницы */
[class*="book-left"]::after,
[class*="book-right"]::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(200, 180, 150, 0.3);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
}

/* Тень от корешка на страницах */
.book-left::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 20px;
    background: linear-gradient(
        to left,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.08) 30%,
        transparent 100%
    );
    pointer-events: none;
    z-index: 2;
}

.book-right::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 20px;
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.08) 30%,
        transparent 100%
    );
    pointer-events: none;
    z-index: 2;
}

/* Шнурки в «дырочках»: короткий сегмент у переплёта; вертикаль — через bookThreadTop() в % высоты разворота */
.book-thread {
    border-radius: 9999px;
    background: linear-gradient(
        180deg,
        #7a5c3e 0%,
        #4a3018 22%,
        #2d1a0c 50%,
        #4a3018 78%,
        #6b4a30 100%
    );
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.45),
        0 0 1px rgba(255, 255, 255, 0.25) inset,
        0 -1px 1px rgba(0, 0, 0, 0.5) inset;
    border: 1px solid rgba(45, 26, 12, 0.35);
}

/* Отверстия уже есть на изображении книги, поэтому дополнительные элементы не нужны */

@keyframes pageFlip {
    0% {
        transform: rotateY(0);
    }

    50% {
        border-radius: 0 100px 0 0;
    }

    100% {
        transform: translateX(-100%) rotateY(-180deg);
    }
}

@keyframes pageFlipPrew {
    0% {
        transform: rotateY(0);
    }

    50% {
        border-radius: 100px 0 0 0;
    }

    100% {
        transform: translateX(100%) rotateY(180deg);
    }
}

.pageFlip {
    overflow: hidden;
    perspective: 1000px;
    animation: pageFlip 1s ease-in-out;
    z-index: 20;
}

.pageFlipPrew {
    overflow: hidden;
    perspective: 1000px;
    animation: pageFlipPrew 1s ease-in-out;
    z-index: 20;
}

/* Скрываем текст во время перелистывания */
.pageFlip .book-text-content,
.pageFlipPrew .book-text-content {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
}

/* Эффект старой бумаги для текстового контента */
.book-text-content {
    background-image: 
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.003) 2px,
            rgba(0, 0, 0, 0.003) 4px
        );
}

/* Стили для абзацев - базовые стили, адаптивность через Tailwind классы */
.book-text p {
    margin: 0 0 0.7em 0;
    text-indent: 1.5em;
    position: relative;
    overflow: visible;
    word-wrap: break-word;
    hyphens: auto;
}


.book-text p:first-child {
    text-indent: 0;
    font-size: 1.05rem;
    line-height: 1.8;
}

/* Декоративная капля для первого абзаца - только псевдоэлемент */
.book-text p:first-child::first-letter {
    font-size: 3.5rem;
    line-height: 0.8;
    float: left;
    padding-right: 0.1em;
    padding-top: 0.05em;
    color: #8b7850;
    font-weight: bold;
    font-family: 'Georgia', serif;
}


/* Заголовки в книге - базовые стили, адаптивность через медиа-запросы (элементы генерируются через markdown) */
.book-text h1,
.book-text h2,
.book-text h4,
.book-text h5,
.book-text h6 {
    font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', serif;
    font-weight: 600;
    color: #2d2d2d;
    margin: 1.2em 0 0.6em 0;
    text-align: left;
    text-indent: 0;
    line-height: 1.4;
    letter-spacing: 0.5px;
    text-shadow: 0.2px 0.2px 0.3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    word-wrap: break-word;
}

.book-text h1 {
    font-size: 2.2rem;
    margin-top: 0;
    margin-bottom: 1em;
    padding-bottom: 0.4em;
    border-bottom: 3px solid rgba(139, 120, 80, 0.4);
    position: relative;
    color: #1a1a1a;
    font-weight: 700;
}

.book-text h1::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, rgba(139, 120, 80, 0.6), transparent);
}

.book-text h2 {
    font-size: 1.8rem;
    color: #252525;
    border-left: 4px solid rgba(139, 120, 80, 0.3);
    padding-left: 0.8em;
    margin-left: -0.8em;
}

/* ============================================
   ОСНОВНОЙ СТИЛЬ H3 ДЛЯ БОЛЬШИХ ЭКРАНОВ (>1024px)
   ИЗМЕНЯЙ ЗДЕСЬ ДЛЯ ДЕСКТОПА!
   ============================================ */
:deep(.book-text h3) {
    font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', serif !important;
    font-size: 1.6em !important;
    font-weight: 700 !important;
    color: #2a2a2a !important;
    font-style: italic !important;
    margin: 1px 20px 20px !important;
    padding-left: 0 !important;
    text-align: center !important;
    text-indent: 0 !important;
    line-height: 1.2 !important;
    letter-spacing: 0.5px !important;
    text-shadow: 0.2px 0.2px 0.3px rgba(0, 0, 0, 0.1) !important;
    overflow: hidden;
    word-wrap: break-word;
}

.book-text h4 {
    font-size: 1.3rem;
    color: #2d2d2d;
}

/* Адаптивность - объединенные медиа-запросы */
@media (max-width: 1024px) {
    .book-text h1 { font-size: 2rem; margin: 0.8em 0 0.6em 0; }
    .book-text h2 { font-size: 1.6rem; }
    :deep(.book-text h3) { font-size: 2.3rem !important; margin-top: 1.6em !important; }
    .book-text p:first-child::first-letter { font-size: 3rem; }
}
@media (max-width: 768px) {
    .book-text h1 { font-size: 1.8rem; margin: 0.6em 0 0.5em 0; padding-bottom: 0.3em; }
    .book-text h2 { font-size: 1.5rem; margin: 1em 0 0.5em 0; }
    :deep(.book-text h3) { font-size: 2.1rem !important; margin-top: 1.4em !important; margin-bottom: 0.6em !important; }
    .book-text h4 { font-size: 1rem; }
    .book-text p { margin-bottom: 0.7em; text-indent: 1em; }
    .book-text p:first-child::first-letter { font-size: 2.5rem; }
    .book-text ul, .book-text ol { margin: 0.7em 0; padding-left: 1.5em; }
    .book-text li { margin: 0.4em 0; line-height: 1.5; }
    .book-text blockquote { margin: 1em 1.2em; padding: 0.7em 1em; font-size: 0.9rem; }
}
@media (max-width: 480px) {
    .book-text h1 { font-size: 1.6rem; margin: 0.5em 0 0.4em 0; padding-bottom: 0.25em; }
    .book-text h2 { font-size: 1.4rem; margin: 0.8em 0 0.4em 0; }
    :deep(.book-text h3) { font-size: 1.9rem !important; margin-top: 1.2em !important; margin-bottom: 0.5em !important; }
    .book-text p { margin-bottom: 0.6em; text-indent: 0.8em; }
    .book-text p:first-child::first-letter { font-size: 2.2rem; }
    .book-text ul, .book-text ol { margin: 0.6em 0; padding-left: 1.2em; }
    .book-text blockquote { margin: 0.8em 1em; padding: 0.6em 0.9em; font-size: 0.85rem; }
}

/* Выделение текста */
.book-text strong,
.book-text b {
    font-weight: 650;
    color: #1a1a1a;
    background: linear-gradient(180deg, transparent 60%, rgba(139, 120, 80, 0.15) 60%);
    padding: 0 0.1em;
}

.book-text em,
.book-text i {
    font-style: italic;
    color: #2d2d2d;
    font-family: 'Georgia', serif;
}

/* Списки - красивые, адаптивность через Tailwind классы */
.book-text ul,
.book-text ol {
    margin: 1em 0;
    padding-left: 2em;
    text-indent: 0;
}

.book-text ul {
    list-style: none;
}

.book-text ul li::before {
    content: '▪';
    color: rgba(139, 120, 80, 0.6);
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1.5em;
    font-size: 1.2rem;
}

.book-text ol {
    counter-reset: item;
}

.book-text ol li {
    counter-increment: item;
    position: relative;
    padding-left: 0.5em;
}

.book-text ol li::before {
    content: counter(item) '.';
    color: rgba(139, 120, 80, 0.7);
    font-weight: 600;
    position: absolute;
    left: -1.5em;
}

.book-text li {
    margin: 0.5em 0;
    line-height: 1.7;
    padding-left: 0.5em;
}

/* Цитаты - элегантные, адаптивность через Tailwind классы */
.book-text blockquote {
    margin: 1.5em 2em;
    padding: 1em 1.5em;
    border-left: 4px solid rgba(139, 120, 80, 0.5);
    border-right: 1px solid rgba(139, 120, 80, 0.2);
    background: linear-gradient(
        to right,
        rgba(250, 245, 240, 0.6) 0%,
        rgba(255, 252, 248, 0.4) 100%
    );
    font-style: italic;
    text-indent: 0;
    font-size: 0.95rem;
    color: #3a3a3a;
    line-height: 1.8;
    position: relative;
    box-shadow: inset 0 0 20px rgba(139, 120, 80, 0.05);
    border-radius: 0 4px 4px 0;
}

.book-text blockquote::before {
    content: '"';
    font-size: 3rem;
    line-height: 0.1em;
    color: rgba(139, 120, 80, 0.3);
    position: absolute;
    left: 0.3em;
    top: 0.3em;
    font-family: 'Georgia', serif;
}

.book-text blockquote::after {
    content: '"';
    font-size: 3rem;
    line-height: 0.1em;
    color: rgba(139, 120, 80, 0.3);
    position: absolute;
    right: 0.3em;
    bottom: 0.1em;
    font-family: 'Georgia', serif;
}

/* Ссылки - элегантные */
.book-text a {
    color: #6b5a3a;
    text-decoration: none;
    border-bottom: 1.5px solid rgba(107, 90, 58, 0.4);
    padding-bottom: 0.1em;
    transition: all 0.3s ease;
    font-weight: 500;
}

.book-text a:hover {
    color: #8b7850;
    border-bottom-color: rgba(139, 120, 80, 0.7);
    background: linear-gradient(180deg, transparent 90%, rgba(139, 120, 80, 0.1) 90%);
}

/* Горизонтальная линия */
.book-text hr {
    border: none;
    border-top: 1px solid rgba(139, 120, 80, 0.3);
    margin: 2em 0;
}

/* Код */
.book-text code {
    background: rgba(240, 240, 240, 0.8);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
}

/* Изображения */
.book-text img {
    max-width: 100%;
    height: auto;
    margin: 1em 0;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Адаптивные стили уже применены через Tailwind классы в шаблоне */

</style>