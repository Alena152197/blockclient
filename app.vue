<template>
  <NuxtLoadingIndicator :throttle="0" />
  <Navbar />
  <!-- flex-auto: заполняет место между шапкой и футером. flex/col + flex-1 на /blog и /contact — чтобы фон на всю высоту main; иначе ломается расклад (напр. настройки + аккордеоны). -->
  <main class="flex-auto bg-[#FFEE00]/70" :class="isFullBleedMainPage ? 'flex min-h-0 flex-col' : ''">
    <NuxtPage :key="route.path" :class="nuxtPageLayoutClass" />
  </main>
  <Up />
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { readBlogDisplayTitle } from '~/utils/blogDisplayTitle'
import { applyBlogSettingsPayload } from '~/utils/blogClientSettingsRemote'
import { STRAPI_BASE } from '~/utils/strapiBase'

const route = useRoute()

const { data: blogSettings } = await useAsyncData('blog-settings', () =>
  $fetch('/api/blog-settings').catch(() => ({}))
)

/** Страницы, где корень должен занимать всю высоту main (фон без «дыр» над/под контентом) */
const isFullBleedMainPage = computed(() => route.path === '/blog' || route.path === '/contact')

const nuxtPageLayoutClass = computed(() =>
  isFullBleedMainPage.value ? 'flex min-h-0 w-full flex-1 flex-col' : 'w-full'
)

const base = STRAPI_BASE
const api = await $fetch(`${base}/api/config?populate=*`)
const config = api.data
const index = useSearchStore()
// Сразу в setup (и на SSR, и на клиенте) — иначе главная с v-if="config.primeryBlock" гидратится с пустым store
index.config = config || {}

/** Свой заголовок вкладки из настроек (localStorage), обновляется событием blog-display-title-changed */
const displayTitleOverride = ref('')

function syncDisplayTitleFromStorage() {
  displayTitleOverride.value = readBlogDisplayTitle()
}

const documentTitle = computed(
  () =>
    displayTitleOverride.value ||
    (typeof blogSettings.value?.blog_display_title === 'string'
      ? blogSettings.value.blog_display_title.trim()
      : '') ||
    config.title
)

useHead({
  title: documentTitle,
  meta: [
    { name: 'description', content: config.desc },
    { name: 'keywords', content: config.keywords },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: base+config.favicon.url }
  ],
  // настройка боди на главной
  bodyAttrs: {
    class: 'bg-white'
  },
  head: {
    script: [
      { src:'https://yastatic.net/share2/share.js', async: true, defer: true }
    ]
  }
})

onMounted(() => {
  if (import.meta.client) {
    document.documentElement.classList.remove('dark')
    try {
      localStorage.removeItem('color-theme')
      // старый persist:true оставлял userMe/config в pinia — убрать, чтобы не мешало
      localStorage.removeItem('search')
    } catch {
      /* ignore */
    }
    if (blogSettings.value && typeof blogSettings.value === 'object') {
      applyBlogSettingsPayload(blogSettings.value)
    }
    syncDisplayTitleFromStorage()
    window.addEventListener('blog-display-title-changed', syncDisplayTitleFromStorage)
    index.loadProfileNote(index.userMe?.id || null)
  }
  // Только после mount: JWT в localStorage, SSR остаётся «гостем» как и первый paint клиента
  index.fetchUserMe()
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('blog-display-title-changed', syncDisplayTitleFromStorage)
  }
})

</script>
