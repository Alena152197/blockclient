<template>
    <h1>консоль</h1>

    <h2>primeryBlock <span class=" text-teal-700">{{ index.config.primeryBlock }}</span></h2> 
    <button class="p-2 bg-teal-300 mx-2 cursor-pointer hover:bg-teal-700 transition-colors" @click="on()">On</button>
    <button class="p-2 bg-teal-300 mx-2 cursor-pointer hover:bg-teal-700 transition-colors" @click="off()">Off</button>
</template>


<script setup>
const index = useSearchStore();

const on = () => {
    try {
        const res = fetch('', {
            method: 'PUT',
            header: `Bearrer `
        })
    } catch (error) {
        
    }
}


const off = () => {
    try {
        const res = fetch('', {
            method: 'PUT',
            header: `Bearrer `
        })
    } catch (error) {
        
    }
}


onMounted(() => {
    if(index.userMe.role?.id !== 3) {
        navigateTo('/profile')
    }
})



</script>