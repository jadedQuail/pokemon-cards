import { defineStore } from "pinia";
import { fetchPokemonData } from "@/services/apiCalls";
import { FieldIds, PokemonFormMode } from "~/static/constants.js";

export const useStore = defineStore("store", {
    state: () => ({
        pokemonData: [],
        editingPokemonId: null,
        dataLoaded: false,
        addPokemonDialogVisible: false,
        pokemonFormMode: PokemonFormMode.None,
        rawFields: {
            [FieldIds.Name]: {
                name: FieldIds.Name,
                content: "",
                valid: true,
            },
            [FieldIds.HP]: {
                name: FieldIds.HP,
                content: "",
                valid: true,
            },
            [FieldIds.Type]: {
                name: FieldIds.Type,
                content: "",
                valid: true,
            },
            [FieldIds.Set]: {
                name: FieldIds.Set,
                content: "",
                valid: true,
            },
            [FieldIds.FlavorText]: {
                name: FieldIds.FlavorText,
                content: "",
                valid: true,
            },
        },
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
        showAddPokemonDialog(formMode) {
            this.pokemonFormMode = formMode;
            this.addPokemonDialogVisible = true;
        },
        hideAddPokemonDialog() {
            this.editingPokemonId = null;
            this.pokemonFormMode = PokemonFormMode.None;
            this.addPokemonDialogVisible = false;
        },
        setFieldContentForEditDialog(pokemon) {
            this.rawFields[FieldIds.Name].content = pokemon.name || "";
            this.rawFields[FieldIds.HP].content = pokemon.hp || "";
            this.rawFields[FieldIds.Type].content = pokemon.type || "";
            this.rawFields[FieldIds.Set].content = pokemon.set || "";
            this.rawFields[FieldIds.FlavorText].content =
                pokemon.flavorText || "";
        },
    },
});
