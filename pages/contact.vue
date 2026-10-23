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
                    class="book-text-content absolute left-0 top-0 z-[5] box-border flex h-full w-full flex-col overflow-hidden bg-[rgba(255,252,248,0.85)] p-6 md:p-7 sm:p-5 max-[480px]:p-4 md:pl-[28px] md:pr-[30px] md:pt-[28px] md:pb-[28px] sm:pl-[26px] sm:pr-[28px] sm:pt-[26px] sm:pb-[26px] lg:p-8"
                >
                    <div class="book-photo-frame relative min-h-0 w-full flex-1 overflow-hidden">
                        <img
                            :src="displayPhotoUrl"
                            alt=""
                            class="h-full w-full rounded-sm object-cover shadow-inner transition-[filter] duration-300"
                            :class="{
                                'opacity-90': !hasCustomPhoto && !isSpreadLocked,
                                'book-page-blurred': isSpreadLocked
                            }"
                        />
                        <div
                            v-if="isSpreadLocked"
                            class="book-lock-overlay absolute inset-0 z-[6] flex flex-col items-center justify-center gap-2 rounded-sm bg-[rgba(40,32,24,0.35)] px-4 text-center"
                        >
                            <svg
                                class="h-12 w-12 text-white drop-shadow-md sm:h-10 sm:w-10"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <p class="text-xs font-medium text-white/95 sm:text-[11px]">По подписке</p>
                        </div>
                    </div>
                    <div
                        v-if="canEditAbout && !isSpreadLocked"
                        class="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-2"
                    >
                        <input
                            ref="photoInputRef"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="onPhotoFile"
                        />
                        <button
                            type="button"
                            class="rounded border border-[#a08b6a] bg-[#f5efe6]/95 px-2.5 py-1 text-xs font-medium text-[#4a3d32] shadow-sm hover:bg-[#ebe4d8] disabled:opacity-50"
                            :disabled="photoBusy || textSaving"
                            @click="photoInputRef?.click()"
                        >
                            {{ photoBusy ? 'Загрузка…' : hasCustomPhoto ? 'Сменить фото' : 'Своё фото' }}
                        </button>
                        <button
                            v-if="hasCustomPhoto"
                            type="button"
                            class="rounded border border-red-200 bg-white/90 px-2.5 py-1 text-xs text-red-800 hover:bg-red-50 disabled:opacity-50"
                            :disabled="photoBusy || textSaving"
                            @click="removePhoto"
                        >
                            Убрать
                        </button>
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
                    class="book-text-content absolute left-0 top-0 z-[5] box-border flex h-full w-full flex-col overflow-hidden bg-[rgba(255,252,248,0.7)] px-6 pb-6 pt-3 sm:px-7 sm:pb-7 sm:pt-3.5 md:px-[30px] md:pb-[28px] md:pt-4 max-[480px]:px-[26px] max-[480px]:pb-[24px] max-[480px]:pt-2.5 lg:px-8 lg:pb-8 lg:pt-4"
                >
                    <template v-if="isEditingText">
                        <input
                            ref="titleEditRef"
                            v-model="draftTitle"
                            type="text"
                            class="book-page-title mb-1.5 w-full shrink-0 rounded-sm border border-[#c4b59a]/60 bg-[#fffdf9]/95 px-2 py-1 text-center font-serif text-[1.15rem] font-semibold leading-snug tracking-wide text-[#3d3428] outline-none focus:border-[#8b7850] md:mb-2 md:text-[1.35rem] sm:text-[1.05rem] max-[480px]:mb-1 max-[480px]:text-[0.95rem]"
                            :disabled="textSaving"
                            placeholder="Заголовок разворота"
                            aria-label="Заголовок разворота"
                            @keydown.stop="onTitleKeydown"
                        />
                        <div
                            class="book-fmt-toolbar mb-2 flex shrink-0 flex-wrap items-center justify-center gap-1"
                            role="toolbar"
                            aria-label="Форматирование текста"
                        >
                            <button
                                type="button"
                                class="book-fmt-btn font-bold"
                                title="Жирный"
                                :disabled="textSaving"
                                @mousedown.prevent
                                @click="applyFormat('bold')"
                            >
                                Ж
                            </button>
                            <button
                                type="button"
                                class="book-fmt-btn italic"
                                title="Курсив"
                                :disabled="textSaving"
                                @mousedown.prevent
                                @click="applyFormat('italic')"
                            >
                                К
                            </button>
                            <button
                                type="button"
                                class="book-fmt-btn underline"
                                title="Подчёркнутый"
                                :disabled="textSaving"
                                @mousedown.prevent
                                @click="applyFormat('underline')"
                            >
                                Ч
                            </button>
                            <select
                                v-model="draftFontSize"
                                class="book-fmt-select"
                                title="Размер текста"
                                :disabled="textSaving"
                                aria-label="Размер текста"
                                @mousedown.stop
                                @change="applyFormat('size')"
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
                                class="book-fmt-btn relative inline-flex cursor-pointer items-center justify-center"
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
                                    :disabled="textSaving"
                                    @mousedown.prevent
                                    @change="applyFormat('color')"
                                />
                            </label>
                            <button
                                type="button"
                                class="book-fmt-btn"
                                title="Ссылка"
                                :disabled="textSaving"
                                @mousedown.prevent
                                @click="applyFormat('link')"
                            >
                                URL
                            </button>
                        </div>
                        <textarea
                            ref="textEditRef"
                            v-model="draftText"
                            class="book-text-edit min-h-0 w-full flex-1 resize-none whitespace-pre-wrap rounded-sm border border-[#c4b59a]/60 bg-[#fffdf9]/95 p-2 font-serif text-[16px] leading-[1.65] text-[#1f1f1f] outline-none focus:border-[#8b7850] md:text-[15px] sm:text-[14px] max-[480px]:text-[13px]"
                            :disabled="textSaving"
                            :maxlength="BOOK_SPREAD_BODY_MAX_CHARS"
                            aria-label="Текст разворота"
                            @keydown.stop="onTextareaKeydown"
                            @keyup.stop
                            @keypress.stop
                            @input="onDraftTextInput"
                        />
                        <div class="mt-2 flex shrink-0 flex-wrap items-center gap-2">
                            <button
                                type="button"
                                class="rounded border border-[#6b5a3a] bg-[#4a3d32] px-3 py-1.5 text-xs font-medium text-[#f5efe6] hover:bg-[#5a4a3a] disabled:opacity-50"
                                :disabled="textSaving"
                                @click="saveText"
                            >
                                {{ textSaving ? 'Сохранение…' : 'Сохранить' }}
                            </button>
                            <button
                                type="button"
                                class="rounded border border-[#a08b6a] bg-[#f5efe6] px-3 py-1.5 text-xs font-medium text-[#4a3d32] hover:bg-[#ebe4d8] disabled:opacity-50"
                                :disabled="textSaving"
                                @click="cancelTextEdit"
                            >
                                Отменить
                            </button>
                            <span
                                class="ml-auto text-[11px] tabular-nums"
                                :class="draftTextLen >= BOOK_SPREAD_BODY_MAX_CHARS ? 'font-medium text-red-700' : 'text-[#6b5a4a]/80'"
                                :title="'Лимит листа: ' + BOOK_SPREAD_BODY_MAX_CHARS + ' символов'"
                            >
                                {{ draftTextLen }} / {{ BOOK_SPREAD_BODY_MAX_CHARS }}
                            </span>
                            <span v-if="editError" class="basis-full text-xs text-red-700">{{ editError }}</span>
                        </div>
                    </template>
                    <template v-else-if="isSpreadLocked">
                        <div
                            class="relative flex min-h-0 flex-1 flex-col overflow-hidden"
                            aria-label="Разворот закрыт для неподписанных"
                        >
                            <div class="book-page-blurred pointer-events-none select-none px-1 pt-0.5" aria-hidden="true">
                                <div
                                    class="mb-3 h-6 w-2/3 mx-auto rounded bg-[#c4b59a]/50"
                                />
                                <div class="space-y-2.5 px-1">
                                    <div class="h-3 w-full rounded bg-[#b8a990]/45" />
                                    <div class="h-3 w-[92%] rounded bg-[#b8a990]/40" />
                                    <div class="h-3 w-full rounded bg-[#b8a990]/45" />
                                    <div class="h-3 w-[78%] rounded bg-[#b8a990]/35" />
                                    <div class="h-3 w-full rounded bg-[#b8a990]/45" />
                                    <div class="h-3 w-[88%] rounded bg-[#b8a990]/40" />
                                    <div class="h-3 w-[60%] rounded bg-[#b8a990]/35" />
                                    <div class="h-3 w-full rounded bg-[#b8a990]/45" />
                                    <div class="h-3 w-[70%] rounded bg-[#b8a990]/40" />
                                </div>
                            </div>
                            <div
                                class="book-lock-overlay absolute inset-0 z-[6] flex flex-col items-center justify-center gap-3 bg-[rgba(40,32,24,0.28)] px-5 text-center"
                            >
                                <svg
                                    class="h-14 w-14 text-[#3d3428] drop-shadow-sm sm:h-12 sm:w-12"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <p class="max-w-[14rem] font-serif text-sm leading-snug text-[#3d3428]">
                                    Дальше — по подписке.
                                </p>
                                <NuxtLink
                                    to="/subscribe"
                                    class="rounded-md border border-[#a08b6a] bg-[#f5efe6] px-3 py-1.5 text-sm font-semibold text-[#4a3d32] shadow-sm hover:bg-[#ebe4d8]"
                                >
                                    Подписаться
                                </NuxtLink>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <h2
                            class="book-page-title mb-2 shrink-0 px-1 pt-0.5 text-center font-serif text-[1.15rem] font-semibold leading-snug tracking-wide text-[#3d3428] md:mb-2.5 md:text-[1.35rem] sm:text-[1.05rem] max-[480px]:mb-1.5 max-[480px]:text-[0.95rem]"
                            :class="canEditAbout ? 'cursor-text rounded-sm hover:bg-[rgba(255,252,248,0.5)]' : ''"
                            :title="canEditAbout ? 'Нажмите, чтобы редактировать заголовок' : undefined"
                            @click="canEditAbout ? startTextEdit('title') : undefined"
                        >
                            <span v-if="spreadTitle">{{ spreadTitle }}</span>
                            <span
                                v-else-if="canEditAbout"
                                class="font-normal italic text-[#6b5a4a]/60"
                            >
                                Заголовок…
                            </span>
                        </h2>
                        <div
                            class="book-text block min-h-0 w-full max-w-full flex-1 overflow-y-auto break-words rounded-sm font-serif text-[17px] leading-[1.7] text-left text-[#1f1f1f] transition-colors duration-300 md:text-[15px] md:leading-[1.65] sm:text-[14px] sm:leading-[1.5] max-[480px]:text-[13px] max-[480px]:leading-[1.4]"
                            :class="canEditAbout ? 'cursor-text ring-0 hover:bg-[rgba(255,252,248,0.35)]' : ''"
                            style="text-shadow: 0.3px 0.3px 0.5px rgba(255, 255, 255, 0.9), 0.1px 0.1px 0.2px rgba(0, 0, 0, 0.05)"
                            :title="canEditAbout ? 'Нажмите, чтобы редактировать' : undefined"
                            role="article"
                            @click="canEditAbout ? startTextEdit('body') : undefined"
                        >
                            <div v-if="textHtml" v-html="textHtml" />
                            <p v-else-if="canEditAbout" class="m-0 italic text-[#6b5a4a]/70">
                                Нажмите, чтобы написать…
                            </p>
                        </div>
                    </template>
                </div>
            </div>
            </div>

            <p v-if="editError && !isEditingText" class="max-w-md px-2 text-center text-sm text-red-700">
                {{ editError }}
            </p>

            <div class="relative flex flex-wrap items-center justify-center gap-3 pb-1 pt-1">
                <button
                    type="button"
                    class="size-12 hover:text-red-600 active:text-black disabled:opacity-40"
                    :disabled="currentPage <= 1 || isEditingText"
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
                    :disabled="currentPage >= totalPages || isEditingText"
                    aria-label="Следующий разворот"
                    @click="nextPage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path
                            d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM17.6575 11.9996L11.7077 17.9493V12.9996H6.34375V10.9996H11.7077V6.0498L17.6575 11.9996Z"
                        />
                    </svg>
                </button>
                <button
                    v-if="canManageContent"
                    type="button"
                    class="ml-1 rounded-md border border-[#a08b6a] bg-[#f5efe6] px-3 py-2 text-sm font-medium text-[#4a3d32] shadow-sm hover:bg-[#ebe4d8] disabled:opacity-50"
                    :disabled="creatingSpread || isEditingText"
                    @click="addSpread"
                >
                    {{ creatingSpread ? 'Создание…' : 'Добавить разворот' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useSearchStore } from '~/stores/search';
import { canManageBlogContent } from '~/utils/strapiUserRole';
import MarkdownIt from 'markdown-it';
import {
    loadPageBgState,
    buildCustomBgLayerStyle,
    buildCustomBgOverlayStyle
} from '~/utils/blogIndexBg';
import {
    spreadFromAboutEntry,
    getAboutEntryForEditor,
    decodeBlankLinesFromMarkdown
} from '~/utils/contactBookSpread';
import {
    BOOK_SPREAD_BODY_MAX_CHARS,
    BOOK_FONT_SIZE_OPTIONS,
    clampBookBodyText,
    wrapTextareaSelection,
    wrapBold,
    wrapItalic,
    wrapUnderline,
    wrapColor,
    wrapFontSize,
    wrapLink
} from '~/utils/contactBookFormat';
import { STRAPI_BASE } from '~/utils/strapiBase';
import { BOOK_THREAD_TOP_PERCENT } from '~/utils/contactBookThreads';
import {
    DEFAULT_CONTACT_BOOK_PHOTO,
    buildAboutContent,
    createAboutEntry,
    leadImageRelativeFromContent,
    updateAboutEntry,
    uploadImageToStrapi
} from '~/utils/contactBookApi';

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
const runtimeConfig = useRuntimeConfig();
const adminAllow = computed(() => ({
    emails: runtimeConfig.public.contentAdminEmails || '',
    usernames: runtimeConfig.public.contentAdminUsernames || '',
}));
/** Админ: роль Admin в Strapi ИЛИ email в NUXT_PUBLIC_CONTENT_ADMIN_EMAILS */
const canManageContent = computed(() =>
    canManageBlogContent(search.userMe, adminAllow.value)
);

/** Бесплатно без подписки — первые N разворотов (счётчик 1…N). */
const freeSpreadLimit = 4;
const isSubscribed = ref(false);

const canReadFullBook = computed(
    () => canManageContent.value || isSubscribed.value
);

const isSpreadLocked = computed(
    () => !canReadFullBook.value && currentPage.value > freeSpreadLimit
);

const canEditAbout = computed(
    () => canManageContent.value && currentEntry.value != null && !isSpreadLocked.value
);

async function refreshSubscribeStatus() {
    if (!import.meta.client) {
        isSubscribed.value = false;
        return;
    }
    const email = search.userMe?.email;
    if (!email) {
        isSubscribed.value = false;
        return;
    }
    try {
        const token = localStorage.getItem('jwt');
        const res = await $fetch('/api/subscribe/status', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            query: { email }
        });
        isSubscribed.value = Boolean(res?.subscribed);
    } catch {
        isSubscribed.value = false;
    }
}

function onSubscribeChanged(e) {
    if (e?.detail?.subscribed != null) {
        isSubscribed.value = Boolean(e.detail.subscribed);
    } else {
        refreshSubscribeStatus();
    }
}

const pageFlipRight = ref(false);
const pageFlipLeft = ref(false);
const currentEntry = ref(null);
const currentPage = ref(1);
const pageSize = 1;
const totalPages = ref(1);
/** breaks + html: цвет/<u>/разрывы абзацев */
const markdown = new MarkdownIt({ breaks: true, html: true });
const leftClass = ref('');

const isEditingText = ref(false);
const draftText = ref('');
const draftTitle = ref('');
const draftTextColor = ref('#8b4513');
const draftFontSize = ref('1em');
const draftTextLen = computed(() => (draftText.value || '').length);
const textSaving = ref(false);
const photoBusy = ref(false);
const creatingSpread = ref(false);
const editError = ref('');
const photoInputRef = ref(null);
const textEditRef = ref(null);
const titleEditRef = ref(null);

const spread = computed(() => spreadFromAboutEntry(currentEntry.value));

const hasCustomPhoto = computed(
    () => !isSpreadLocked.value && Boolean(spread.value?.imageUrl)
);

const displayPhotoUrl = computed(() => {
    // Замок: не отдаём URL реального фото в DOM
    if (isSpreadLocked.value) return DEFAULT_CONTACT_BOOK_PHOTO;
    return spread.value?.imageUrl || DEFAULT_CONTACT_BOOK_PHOTO;
});

const spreadTitle = computed(() => {
    if (isSpreadLocked.value) return '';
    const t = spread.value?.title;
    return typeof t === 'string' && t.trim() ? t.trim() : '';
});

const textHtml = computed(() => {
    if (isSpreadLocked.value) return '';
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

async function focusTextEdit(target = 'body') {
    await nextTick();
    if (target === 'title') {
        const titleInput = titleEditRef.value;
        titleInput?.focus?.({ preventScroll: true });
        titleInput?.select?.();
        return;
    }
    const el = textEditRef.value;
    if (!el) return;
    el.focus({ preventScroll: true });
    try {
        const len = el.value?.length ?? 0;
        el.setSelectionRange(len, len);
    } catch {
        /* ignore */
    }
}

/**
 * @param {'body' | 'title'} [target]
 */
async function startTextEdit(target = 'body') {
    if (!canEditAbout.value || isEditingText.value) return;
    editError.value = '';
    draftTitle.value = spread.value?.title || '';
    // Не clamp при открытии — иначе длинный сохранённый текст срезается и пропадает после Save
    draftText.value = decodeBlankLinesFromMarkdown(spread.value?.textMarkdown || '');
    isEditingText.value = true;
    await focusTextEdit(target);
}

function onDraftTextInput() {
    // Режем только новый набор сверх лимита
    if ((draftText.value || '').length > BOOK_SPREAD_BODY_MAX_CHARS) {
        draftText.value = clampBookBodyText(draftText.value);
    }
}

function cancelTextEdit() {
    isEditingText.value = false;
    draftText.value = '';
    draftTitle.value = '';
    editError.value = '';
}

function onTitleKeydown(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        cancelTextEdit();
    }
}

function applyFormat(kind) {
    const el = textEditRef.value;
    if (!el || textSaving.value) return;
    const setValue = (next) => {
        const clamped = clampBookBodyText(next);
        if (clamped.length < next.length) {
            editError.value = `Текст листа — максимум ${BOOK_SPREAD_BODY_MAX_CHARS} символов.`;
        }
        draftText.value = clamped;
    };
    if (kind === 'bold') {
        wrapTextareaSelection(el, wrapBold, setValue);
        return;
    }
    if (kind === 'italic') {
        wrapTextareaSelection(el, wrapItalic, setValue);
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
        wrapTextareaSelection(el, (sel) => wrapLink(sel, url), setValue);
    }
}

async function saveText() {
    if (!currentEntry.value) return;
    textSaving.value = true;
    editError.value = '';
    try {
        let body = draftText.value || '';
        if (body.length > BOOK_SPREAD_BODY_MAX_CHARS) {
            body = clampBookBodyText(body);
            draftText.value = body;
            editError.value = `Текст обрезан до ${BOOK_SPREAD_BODY_MAX_CHARS} символов (лимит листа).`;
        }
        const { content: fullContent } = getAboutEntryForEditor(currentEntry.value);
        const lead = leadImageRelativeFromContent(fullContent);
        const nextContent = buildAboutContent(body, lead);
        await updateAboutEntry(currentEntry.value, {
            content: nextContent,
            title: draftTitle.value.trim()
        });
        isEditingText.value = false;
        draftText.value = '';
        draftTitle.value = '';
        await fetchSpread();
    } catch (e) {
        editError.value = e?.message || 'Не удалось сохранить.';
    } finally {
        textSaving.value = false;
    }
}

async function onPhotoFile(event) {
    const input = event.target;
    const file = input?.files?.[0];
    if (!file || !currentEntry.value) return;

    photoBusy.value = true;
    editError.value = '';
    try {
        const relativeUrl = await uploadImageToStrapi(file);
        const { title } = getAboutEntryForEditor(currentEntry.value);
        const nextContent = buildAboutContent(spread.value.textMarkdown || '', relativeUrl);
        await updateAboutEntry(currentEntry.value, { content: nextContent, title });
        await fetchSpread();
    } catch (e) {
        editError.value = e?.message || 'Ошибка загрузки фото.';
    } finally {
        photoBusy.value = false;
        if (input) input.value = '';
    }
}

async function removePhoto() {
    if (!currentEntry.value || !hasCustomPhoto.value) return;
    photoBusy.value = true;
    editError.value = '';
    try {
        const { title } = getAboutEntryForEditor(currentEntry.value);
        const nextContent = buildAboutContent(spread.value.textMarkdown || '', null);
        await updateAboutEntry(currentEntry.value, { content: nextContent, title });
        await fetchSpread();
    } catch (e) {
        editError.value = e?.message || 'Не удалось убрать фото.';
    } finally {
        photoBusy.value = false;
    }
}

async function addSpread() {
    if (!canManageContent.value) return;
    creatingSpread.value = true;
    editError.value = '';
    try {
        const sample = currentEntry.value
            ? getAboutEntryForEditor(currentEntry.value)
            : { bodyField: 'content' };
        await createAboutEntry({ bodyField: sample.bodyField || 'content' });
        // Перейти на последний разворот
        const countUrl = `${STRAPI_BASE}/api/abouts?pagination[page]=1&pagination[pageSize]=1&sort=createdAt:asc`;
        const res = await fetch(countUrl);
        const data = await res.json().catch(() => ({}));
        const pageCount = data.meta?.pagination?.pageCount;
        const total = data.meta?.pagination?.total;
        if (typeof pageCount === 'number') {
            currentPage.value = Math.max(1, pageCount);
        } else if (typeof total === 'number') {
            currentPage.value = Math.max(1, total);
        } else {
            currentPage.value = totalPages.value + 1;
        }
        cancelTextEdit();
        await fetchSpread();
    } catch (e) {
        editError.value = e?.message || 'Не удалось создать разворот.';
    } finally {
        creatingSpread.value = false;
    }
}

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
    if (currentPage.value >= totalPages.value || isEditingText.value) return;
    currentPage.value += 1;
    await fetchSpread();
    flip('next');
};

const prevPage = async () => {
    if (currentPage.value <= 1 || isEditingText.value) return;
    currentPage.value -= 1;
    await fetchSpread();
    flip('prev');
};

/** Только Esc; пробел/Enter не трогаем (иначе не печатаются). */
function onTextareaKeydown(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        cancelTextEdit();
        return;
    }
    // Явно не preventDefault на пробел/Enter — и гасим всплытие (уже .stop)
    if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
        e.stopPropagation();
    }
}

/** Листание стрелками — только когда НЕ редактируем текст. */
function onKeydown(e) {
    if (isEditingText.value) return;
    const t = e.target;
    const tag = t && /** @type {HTMLElement} */ (t).tagName;
    if (
        tag === 'TEXTAREA' ||
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        (t && /** @type {HTMLElement} */ (t).isContentEditable)
    ) {
        return;
    }
    // Пробел / Enter никогда не перехватываем (кнопки, скролл, ввод)
    if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextPage();
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
    }
}

function bindPageKeys() {
    window.addEventListener('keydown', onKeydown);
}
function unbindPageKeys() {
    window.removeEventListener('keydown', onKeydown);
}

// Пока открыт редактор — глобальный keydown выключен (фокус ставит startTextEdit)
watch(isEditingText, (editing) => {
    if (!import.meta.client) return;
    if (editing) unbindPageKeys();
    else bindPageKeys();
});

onMounted(async () => {
    await fetchSpread();
    if (!import.meta.client) return;
    try {
        if (localStorage.getItem('jwt')) {
            await search.fetchUserMe();
        }
    } catch {
        /* ignore */
    }
    await refreshSubscribeStatus();
    loadContactBackground();
    window.addEventListener('contact-page-bg-changed', onContactPageBgChanged);
    window.addEventListener('blog-subscribe-changed', onSubscribeChanged);
    if (!isEditingText.value) bindPageKeys();
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('contact-page-bg-changed', onContactPageBgChanged);
        window.removeEventListener('blog-subscribe-changed', onSubscribeChanged);
        unbindPageKeys();
    }
});
</script>

<style scoped>
.book-page-blurred {
    filter: blur(7px);
    transform: scale(1.02);
    user-select: none;
}

.book-lock-overlay {
    backdrop-filter: blur(1px);
}

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

.book-fmt-btn {
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
.book-fmt-btn:hover:not(:disabled) {
    background: #ebe4d8;
}
.book-fmt-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.book-fmt-select {
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
.book-fmt-select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Стили для абзацев - базовые стили, адаптивность через Tailwind классы */
.book-text p {
    margin: 0 0 0.85em 0;
    text-indent: 1.5em;
    position: relative;
    overflow: visible;
    word-wrap: break-word;
    hyphens: auto;
}

.book-text u {
    text-decoration: underline;
    text-underline-offset: 0.12em;
}

.book-text a {
    color: #6b5a3a;
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

.book-text strong,
.book-text b {
    font-weight: 700;
}

.book-text em,
.book-text i {
    font-style: italic;
}

/* Пустой абзац (`&nbsp;` после сохранения) — видимый «пробел» между блоками */
.book-text p:has(> br:only-child),
.book-text p:empty {
    text-indent: 0;
    min-height: 1em;
    margin-bottom: 0.85em;
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