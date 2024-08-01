<template>
    <TopBar />
</template>

<script setup>
import { ref } from 'vue';
import TopBar from '../components/TopBar.vue';

const showForm = ref(false);

const toggleForm = () => {
    showForm.value = !showForm.value;
}
</script>

<style>

    .logo-img {
        width: 200px;
    }
</style>
