<template>
    <PostEditorForm :document-id="documentId" />
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({
    middleware: ['settings-admin'],
    ssr: false
})

const route = useRoute()
const documentId = computed(() => String(route.params.id || ''))
</script>
