<template>
    <h1>hello</h1>
</template>

<script setup>

const stringSearch = ref('')
const response = await $fetch('http://324cbb377ef9.vps.myjino.ru/api/posts?filters[$or][0][title][$containsi]=${stringSearch}&filters[$or][1][body][$containsi]=${stringSearch}')

</script>