<template>
    <NuxtPage />
</template>

<script setup>
/**
 * Родительский маршрут /settings: дочерние страницы (index, views) рендерятся в <NuxtPage />.
 * Без этого вложенный /settings/views не отображался при клике по ссылке.
 */
definePageMeta({
    middleware: ['settings-admin'],
    ssr: false
});
</script>
