<template>
  <NuxtLoadingIndicator :throttle="0" />
  <Navbar />
  <!-- flex auto -->
  <main class=" bg-[#FFEE00]/70 flex-auto"> 
  <NuxtPage />
  </main>
  <Up />
  <Footer />
</template>

<script setup>
const base = 'https://324cbb377ef9.vps.myjino.ru'
const api = await $fetch(`${base}/api/config?populate=*`)
const config = api.data
const index = useSearchStore();

useHead({
  title: config.title,
  meta: [
    { name: 'description', content: config.desc },
    { name: 'keywords', content: config.keywords },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: base+config.favicon.url }
  ],
  // настройка боди на главной
  bodyAttrs: {
    class: 'bg-white dark:bg-gray-900'
  },
  head: {
    script: [
      { src:'https://yastatic.net/share2/share.js', async: true, defer: true }
    ]
  }
})

onMounted(() => {
  index.fetchUserMe();
  index.config = config;
  
})

</script>


