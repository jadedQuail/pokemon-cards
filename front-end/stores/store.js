import { defineStore } from "pinia";

// TODO: Split out this store

import { fetchPokemonData } from "@/services/apiClient/pokemon.js";
import { getSetOptions, addSet, deleteSet } from "@/services/apiClient/set.js";
import {
    getTypeOptions,
    addType,
    deleteType,
} from "@/services/apiClient/type.js";

import {
    AddPokemonFieldIds,
    PokemonFormMode,
    CategoriesFormMode,
} from "~/static/constants.js";

export const useStore = defineStore("store", {
    state: () => ({
        pokemonData: [],
        editingPokemonId: null,
        dataLoaded: false,
        addPokemonDialogVisible: false,
        categoriesDialogVisible: false,
        pokemonFormMode: PokemonFormMode.None,
        categoriesFormMode: CategoriesFormMode.None,
        types: [],
        sets: [],
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
        async loadTypeOptions(apiUrl) {
            try {
                this.types = await getTypeOptions(apiUrl);
            } catch (error) {
                console.error("Error fetching type options:", error);
            }
        },
        async loadSetOptions(apiUrl) {
            try {
                this.sets = await getSetOptions(apiUrl);
            } catch (error) {
                console.error("Error fetching set options:", error);
            }
        },
        async addCategory(apiUrl, categoryName) {
            if (this.categoriesFormMode === CategoriesFormMode.Types) {
                await addType(apiUrl, categoryName);
            } else {
                await addSet(apiUrl, categoryName);
            }
            await this.refreshCategories(apiUrl);
            await this.fetchPokemonData(apiUrl);
        },
        async removeCategories(apiUrl, categoriesToRemove) {
            const isType = this.categoriesFormMode === CategoriesFormMode.Types;

            for (const category of categoriesToRemove) {
                if (isType) {
                    await deleteType(apiUrl, category);
                } else {
                    await deleteSet(apiUrl, category);
                }
            }

            await this.refreshCategories(apiUrl);
            await this.fetchPokemonData(apiUrl);
        },
        async refreshCategories(apiUrl) {
            await this.loadTypeOptions(apiUrl);
            await this.loadSetOptions(apiUrl);
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
        showCategoriesDialog(formMode) {
            this.categoriesFormMode = formMode;
            this.categoriesDialogVisible = true;
        },
        hideCategoriesDialog() {
            this.categoriesDialogVisible = false;
            this.categoriesFormMode = CategoriesFormMode.None;
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
