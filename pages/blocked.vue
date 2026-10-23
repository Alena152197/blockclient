<template>
  <main class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center">
    <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900">Доступ ограничен</h1>
    <p class="mb-8 text-sm leading-relaxed text-gray-600">
      Администратор заблокировал ваш доступ к этому сайту. Если это ошибка — напишите на почту
      владельца блога.
    </p>
    <NuxtLink
      to="/"
      class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
    >
      На главную
    </NuxtLink>
  </main>
</template>

<script setup>
definePageMeta({
  ssr: false
})

useHead({
  title: 'Доступ ограничен'
})

onMounted(() => {
  try {
    const search = useSearchStore()
    if (localStorage.getItem('jwt')) {
      search.logout()
    }
  } catch {
    /* ignore */
  }
})
</script>
