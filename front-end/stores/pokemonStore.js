import { defineStore } from "pinia";
import { fetchPokemonData } from "@/services/apiClient/pokemon.js";
import { AddPokemonFieldId, PokemonFormMode } from "~/static/constants";

export const usePokemonStore = defineStore("pokemon", {
    state: () => ({
        pokemonData: [],
        dataLoaded: false,
        editingPokemonId: null,
        addPokemonDialogVisible: false,
        pokemonFormMode: PokemonFormMode.None,
        addPokemonFields: {
            [AddPokemonFieldId.ID]: {
                name: AddPokemonFieldId.ID,
                content: "",
                valid: true,
            },
            [AddPokemonFieldId.Name]: {
                name: AddPokemonFieldId.Name,
                content: "",
                valid: true,
            },
            [AddPokemonFieldId.HP]: {
                name: AddPokemonFieldId.HP,
                content: "",
                valid: true,
            },
            [AddPokemonFieldId.Type]: {
                name: AddPokemonFieldId.Type,
                content: "",
                valid: true,
            },
            [AddPokemonFieldId.Set]: {
                name: AddPokemonFieldId.Set,
                content: "",
                valid: true,
            },
            [AddPokemonFieldId.FlavorText]: {
                name: AddPokemonFieldId.FlavorText,
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
            this.addPokemonFields[AddPokemonFieldId.ID].content =
                pokemon.id || "";
            this.addPokemonFields[AddPokemonFieldId.Name].content =
                pokemon.name || "";
            this.addPokemonFields[AddPokemonFieldId.HP].content =
                pokemon.hp || "";
            this.addPokemonFields[AddPokemonFieldId.Type].content =
                pokemon.type || "";
            this.addPokemonFields[AddPokemonFieldId.Set].content =
                pokemon.set || "";
            this.addPokemonFields[AddPokemonFieldId.FlavorText].content =
                pokemon.flavorText || "";
        },
    },
});
