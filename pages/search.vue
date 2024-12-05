<template>
    <h1>hello</h1>
    <main>
        <article v-for="post in posts" :key="post.Required">
            <h3>{{ post.title }}</h3>
        </article>
    </main>
</template>

<script setup>

const search = useSearchStore()
const posts = ref()

async function searchAlert() {
    console.log(search.searchQuery);

    try {
        const response = await $fetch('http://324cbb377ef9.vps.myjino.ru/api/posts?filters[$or][0][title][$containsi]=${search.searchQuery}&filters[$or][1][body][$containsi]=${search.searchQuery}')
        posts = response.data;
    } catch (error) {
        console.error('bla bla bla', error);
    }
}

onMounted(() => searcAlert())

</script>