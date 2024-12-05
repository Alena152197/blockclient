<template>
    <h1>hello</h1>
    <main>
        <article v-for="post in posts" :key="post.Required"></article>
    </main>
</template>

<script setup>
import { useSearchStore } from '~/stores/search';


const search = useSearchStore()
const posts = ref()

async function searcAlert() {
    console.log(search.searchQuery);

    try {
        const response = await $fetch('http://324cbb377ef9.vps.myjino.ru/api/posts?filters[$or][0][title][$containsi]=${search.searchQuery}&filters[$or][1][body][$containsi]=${search.searchQuery}')
        const searchResponse = response.data;
    } catch (error) {
        console.error('bla bla bla', error);
    }
}

onMounted(() => {
    searcAlert()
})

</script>