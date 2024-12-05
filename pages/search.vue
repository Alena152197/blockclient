<template>
    <h1>hello</h1>
    <main>
        <button @click="searcAlert">click</button>
        {{ search }}
    </main>
</template>

<script setup>
import { useSearchStore } from '~/stores/search';


const search = useSearchStore()

function searcAlert() {
    console.log(search.searchQuery);
    
}

const response = await $fetch('http://324cbb377ef9.vps.myjino.ru/api/posts?filters[$or][0][title][$containsi]=${stringSearch}&filters[$or][1][body][$containsi]=${stringSearch}')
const searchResponse = response.data

</script>