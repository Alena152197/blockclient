<template>
    <PostEditorForm />
</template>

<script setup>
definePageMeta({
    middleware: ['settings-admin'],
    ssr: false
})
</script>
