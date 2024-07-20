<template>
    <div>
        <img class="logo-img" alt="Pokeball logo" src="./assets/pokemon-svgrepo-com.png">
        <h1 class="font-sans text-4xl text-indigo-400 mb-10">
            Pok&eacute;mon Cards
        </h1>
        <div class="mb-10">
            <Button text="Add Pok&eacute;mon" color="blue" @click="toggleForm" v-if="!showForm" />
            <Button text="Go Back" color="red" @click="toggleForm" v-if="showForm" />
        </div>
        <div class="mb-40">
            <DataTable v-if="!showForm" />
            <AddPokemon v-if="showForm" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from './components/Button.vue';
import DataTable from './components/DataTable.vue';
import AddPokemon from './components/AddPokemon.vue';

const showForm = ref(false);

const toggleForm = () => {
    showForm.value = !showForm.value;
}
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .logo-img {
        width: 200px;
        display: block;
        margin: 0 auto;
    }
</style>
