<template>
    <div ref="rootRef" class="relative inline-flex">
        <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a79d1c]/40 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            :aria-expanded="menuOpen"
            aria-haspopup="menu"
            :disabled="!shareUrl"
            @click.stop="onShareClick"
        >
            <svg class="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" aria-hidden="true">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.251.68.251 1.036 0 .356-.071.712-.251 1.036m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
            </svg>
            {{ copied ? 'Скопировано' : 'Поделиться' }}
        </button>

        <div
            v-if="menuOpen"
            class="absolute bottom-full left-0 z-30 mb-2 min-w-[11.5rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
            role="menu"
        >
            <a
                v-for="item in shareLinks"
                :key="item.id"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                @click.stop="menuOpen = false"
            >
                {{ item.label }}
            </a>
            <button
                type="button"
                class="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                @click.stop="copyLink"
            >
                Скопировать ссылку
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    /** documentId или id поста */
    postId: { type: [String, Number], required: true },
    title: { type: String, default: '' }
})

const rootRef = ref(null)
const menuOpen = ref(false)
const copied = ref(false)
let copiedTimer = null

const shareUrl = computed(() => {
    if (!import.meta.client || props.postId == null || props.postId === '') return ''
    const origin = window.location.origin
    return `${origin}/post/${encodeURIComponent(String(props.postId))}`
})

const shareText = computed(() => {
    const t = String(props.title || '').trim()
    return t || 'Интересная статья'
})

const shareLinks = computed(() => {
    const url = encodeURIComponent(shareUrl.value)
    const text = encodeURIComponent(shareText.value)
    return [
        {
            id: 'telegram',
            label: 'Telegram',
            href: `https://t.me/share/url?url=${url}&text=${text}`
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            href: `https://wa.me/?text=${encodeURIComponent(`${shareText.value}\n${shareUrl.value}`)}`
        },
        {
            id: 'vk',
            label: 'ВКонтакте',
            href: `https://vk.com/share.php?url=${url}&title=${text}`
        },
        {
            id: 'ok',
            label: 'Одноклассники',
            href: `https://connect.ok.ru/offer?url=${url}&title=${text}`
        }
    ]
})

async function onShareClick() {
    if (!shareUrl.value) return
    menuOpen.value = false

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            await navigator.share({
                title: shareText.value,
                text: shareText.value,
                url: shareUrl.value
            })
            return
        } catch (e) {
            if (e?.name === 'AbortError') return
            /* fallback — меню ниже */
        }
    }
    menuOpen.value = !menuOpen.value
}

async function copyLink() {
    if (!shareUrl.value) return
    try {
        await navigator.clipboard.writeText(shareUrl.value)
    } catch {
        try {
            const ta = document.createElement('textarea')
            ta.value = shareUrl.value
            ta.setAttribute('readonly', '')
            ta.style.position = 'fixed'
            ta.style.left = '-9999px'
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
        } catch {
            /* ignore */
        }
    }
    menuOpen.value = false
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
        copied.value = false
    }, 1800)
}

function onDocClick(e) {
    if (!menuOpen.value) return
    const el = rootRef.value
    if (el && e.target instanceof Node && !el.contains(e.target)) {
        menuOpen.value = false
    }
}

onMounted(() => {
    if (import.meta.client) {
        document.addEventListener('click', onDocClick)
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        document.removeEventListener('click', onDocClick)
    }
    if (copiedTimer) clearTimeout(copiedTimer)
})
</script>
