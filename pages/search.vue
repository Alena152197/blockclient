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
const textSearch = ref('')

search.searchQuery = textSearch.value

console.log(search.searchQuery);


// onMounted(() => searchAlert())

</script>