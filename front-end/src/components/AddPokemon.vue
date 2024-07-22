<template>
    <div class="flex items-center justify-center">
    <form class="border border-black rounded shadow-lg p-10">
        <!-- Pokemon Name -->
        <label class="add-pokemon-label" for="name">Name:</label><br />
        <input
        v-model="formData.pokemonName"
        class="add-pokemon-input"
        type="text"
        id="name"
        name="name"
        /><br />

        <!-- HP -->
        <label class="add-pokemon-label" for="hp">HP:</label><br />
        <input
        v-model="formData.pokemonHP"
        class="add-pokemon-input"
        type="number"
        id="hp"
        name="hp"
        value="0"
        /><br />

        <!-- Type -->
        <label class="add-pokemon-label" for="type">Type:</label><br />
        <select v-model="formData.pokemonType" class="add-pokemon-input" name="type" id="type">
            <option v-for="type in types" :key="type" :value="type">
                {{ type }}
            </option>
        </select><br />

        <!-- Set -->
        <label class="add-pokemon-label" for="set">Set:</label><br />
        <select v-model="formData.pokemonSet" class="add-pokemon-input" name="set" id="set">
            <option v-for="set in sets" :key="set" :value="set">
                {{ set }}
            </option>
        </select><br />

        <!-- Flavor Text -->
        <p><label class="add-pokemon-label" for="flavor-text">Flavor Text:</label><br /></p>
        <textarea
        v-model="formData.pokemonFlavorText"
        class="add-pokemon-input"
        id="flavor-text"
        name="flavor-text"
        rows="4"
        cols="50"
        ></textarea
        ><br />

        <!-- Submit Button -->
        <Button text="Submit" @click="submitPokemon" color="green" />
    </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Button from "./Button.vue";
import axios from 'axios';

const formData = ref({});

const types = ref([]);
const sets = ref([]);

const emit = defineEmits(['pokemon-added']);

const submitPokemon = async() => {
    try {
        const dataToSend = { ...formData.value };
        const response = await axios.post(
            `${process.env.VUE_APP_API_URL}/add-pokemon`, 
            dataToSend,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        // Emit event after successful POST request to add a new pokemon
        emit('pokemon-added');
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

const getTypeOptions = async() => {
    try {
        const response = await axios.get(process.env.VUE_APP_API_URL + '/get-type-options');
        types.value = Object.values(response.data);
    } catch (error) {
        console.error('Error fetching type options for "Add Pokemon" form:', error)
    }
}

const getSetOptions = async() => {
    try {
        const response = await axios.get(process.env.VUE_APP_API_URL + '/get-set-options');
        sets.value = Object.values(response.data);
    } catch (error) {
        console.error('Error fetching set options for "Add Pokemon" form:', error)
    }
}

// Lifecycle Hooks
onMounted(() => {
    getTypeOptions();
    getSetOptions();
})

</script>

<style scoped>
.add-pokemon-input {
    @apply border border-black 
    rounded-sm px-2 py-1 mb-3 w-full text-2xl;
}

.add-pokemon-label {
    @apply text-2xl;
}
</style>
