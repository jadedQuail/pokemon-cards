import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore("store", {
    state: () => ({
        pokemonData: [],
        dataLoaded: false,
    }),

    actions: {
        async fetchPokemonData(apiUrl) {
            try {
                const response = await axios.get(apiUrl);
                this.pokemonData = response.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.dataLoaded = true;
            }
        },
    },
});
