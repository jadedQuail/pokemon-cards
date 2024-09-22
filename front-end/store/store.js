import { defineStore } from "pinia";
import { fetchPokemonData } from "@/services/apiCalls";

export const useStore = defineStore("store", {
    state: () => ({
        pokemonData: [],
        dataLoaded: false,
    }),

    actions: {
        async fetchPokemonData(apiUrl) {
            try {
                this.dataLoaded = false;
                this.pokemonData = await fetchPokemonData(apiUrl);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.dataLoaded = true;
            }
        },
    },
});
