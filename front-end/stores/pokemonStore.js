import { defineStore } from "pinia";
import { fetchPokemonData } from "@/services/apiClient/pokemon.js";
import { AddPokemonFieldIds, PokemonFormMode } from "~/static/constants.js";

export const usePokemonStore = defineStore("pokemon", {
    state: () => ({
        pokemonData: [],
        dataLoaded: false,
        editingPokemonId: null,
        addPokemonDialogVisible: false,
        pokemonFormMode: PokemonFormMode.None,
        addPokemonFields: {
            [AddPokemonFieldIds.ID]: {
                name: AddPokemonFieldIds.ID,
                content: "",
                valid: true,
            },
            [AddPokemonFieldIds.Name]: {
                name: AddPokemonFieldIds.Name,
                content: "",
                valid: true,
            },
            [AddPokemonFieldIds.HP]: {
                name: AddPokemonFieldIds.HP,
                content: "",
                valid: true,
            },
            [AddPokemonFieldIds.Type]: {
                name: AddPokemonFieldIds.Type,
                content: "",
                valid: true,
            },
            [AddPokemonFieldIds.Set]: {
                name: AddPokemonFieldIds.Set,
                content: "",
                valid: true,
            },
            [AddPokemonFieldIds.FlavorText]: {
                name: AddPokemonFieldIds.FlavorText,
                content: "",
                valid: true,
            },
        },
    }),
    actions: {
        async fetchPokemonData() {
            try {
                this.dataLoaded = false;
                this.pokemonData = await fetchPokemonData();
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
            this.addPokemonFields[AddPokemonFieldIds.ID].content =
                pokemon.id || "";
            this.addPokemonFields[AddPokemonFieldIds.Name].content =
                pokemon.name || "";
            this.addPokemonFields[AddPokemonFieldIds.HP].content =
                pokemon.hp || "";
            this.addPokemonFields[AddPokemonFieldIds.Type].content =
                pokemon.type || "";
            this.addPokemonFields[AddPokemonFieldIds.Set].content =
                pokemon.set || "";
            this.addPokemonFields[AddPokemonFieldIds.FlavorText].content =
                pokemon.flavorText || "";
        },
    },
});
