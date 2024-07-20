<template>
  <form>
    <!-- Pokemon Name -->
    <label for="name">Name:</label><br />
    <input
      v-model="formData.pokemonName"
      class="add-pokemon-input"
      type="text"
      id="name"
      name="name"
    /><br />

    <!-- HP -->
    <label for="hp">HP:</label><br />
    <input
      v-model="formData.pokemonHP"
      class="add-pokemon-input"
      type="number"
      id="hp"
      name="hp"
      value="0"
    /><br />

    <!-- Type -->
    <label for="type">Type:</label><br />
    <select v-model="formData.pokemonType" class="add-pokemon-input" name="type" id="type">
        <option v-for="type in types" :key="type" :value="type">
            {{ type }}
        </option>
    </select><br />

    <!-- Set -->
    <label for="set">Set:</label><br />
    <select v-model="formData.pokemonSet" class="add-pokemon-input" name="set" id="set">
      <option value="temporal-forces">Temporal Forces</option>
      <option value="paldea-evolved">Paldea Evolved</option></select
    ><br />

    <!-- Flavor Text -->
    <p><label for="flavor-text">Flavor Text:</label><br /></p>
    <textarea
      v-model="formData.flavorText"
      class="add-pokemon-input"
      id="flavor-text"
      name="flavor-text"
      rows="3"
      cols="50"
    ></textarea
    ><br />

    <!-- Submit Button -->
    <Button text="Submit" @click="submitPokemon" color="green" />
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Button from "./Button.vue";
import axios from 'axios';

const formData = ref({
  pokemonName: "",
  pokemonHP: "",
  pokemonType: "",
  pokemonSet: "",
  pokemonFlavorText: "",
});

const types = ref([]);

const submitPokemon = async() => {
    try {
        const dataToSend = { ...formData.value };
        console.log(dataToSend);
        const response = await axios.post(
            `${process.env.VUE_APP_API_URL}/add-pokemon`, 
            dataToSend,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

const getTypeOptions = async() => {
    console.log("In here!");
    try {
        const response = await axios.get(process.env.VUE_APP_API_URL + '/get-type-options');
        types.value = Object.values(response.data);
    } catch (error) {
        console.error('Error fetching type options for "Add Pokemon" form:', error)
    }
}

// Lifecycle Hooks
onMounted(() => {
    getTypeOptions();
})

</script>

<style scoped>
.add-pokemon-input {
  @apply border border-black rounded-sm px-2 py-1;
}
</style>
