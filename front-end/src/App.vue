<template>
    <div>
        <div class="mt-20 flex flex-col items-center text-center">
            <img class="logo-img" alt="Pokeball logo" src="./assets/pokemon-svgrepo-com.png">
            <h1 class="font-sans text-4xl text-indigo-400 mb-10">
                Pok&eacute;mon Cards
            </h1>
            <div class="mb-10">
                <Button text="Add Pok&eacute;mon" color="blue" @click="toggleForm" v-if="!showForm" />
                <Button text="Go Back" color="red" @click="toggleForm" v-if="showForm" />
            </div>
        </div>
        <div class="mb-40">
            <DataTable v-if="!showForm" />
            <AddPokemon v-if="showForm" @pokemon-added="toggleForm" />
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
    console.log("Called!");
    showForm.value = !showForm.value;
}
</script>

<style>

    .logo-img {
        width: 200px;
    }
</style>
