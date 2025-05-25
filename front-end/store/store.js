import { defineStore } from "pinia";
import {
    fetchPokemonData,
    getTypeOptions,
    getSetOptions,
    addType,
    addSet,
    deleteType,
    deleteSet,
} from "@/services/apiCalls";
import {
    FieldIds,
    LoginFieldIds,
    PokemonFormMode,
    CategoriesFormMode,
} from "~/static/constants.js";

function getNullUser() {
    return {
        id: null,
        username: "",
        isAdmin: false,
    };
}

export const useStore = defineStore("store", {
    state: () => ({
        user: getNullUser(),
        isAuthInitialized: false,
        pokemonData: [],
        editingPokemonId: null,
        dataLoaded: false,
        addPokemonDialogVisible: false,
        categoriesDialogVisible: false,
        loginDialogVisible: false,
        logoutDialogVisible: false,
        pokemonFormMode: PokemonFormMode.None,
        categoriesFormMode: CategoriesFormMode.None,
        types: [],
        sets: [],
        // TO-DO: Rename this to be more indicative of fields specifically for adding pokemon
        loginFields: {
            [LoginFieldIds.Username]: {
                name: LoginFieldIds.Username,
                content: "",
                valid: true,
            },
            [LoginFieldIds.Password]: {
                name: LoginFieldIds.Password,
                content: "",
                valid: true,
            },
        },
        rawFields: {
            [FieldIds.ID]: {
                name: FieldIds.ID,
                content: "",
                valid: true,
            },
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

    getters: {
        isLoggedIn: (state) => {
            return (
                state.user &&
                typeof state.user.id === "number" &&
                state.user.id !== null
            );
        },
    },

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
        showLoginDialog() {
            this.loginDialogVisible = true;
        },
        hideLoginDialog() {
            this.loginDialogVisible = false;
        },
        showLogoutDialog() {
            this.logoutDialogVisible = true;
        },
        hideLogoutDialog() {
            this.logoutDialogVisible = false;
        },
        setFieldContentForEditDialog(pokemon) {
            this.rawFields[FieldIds.ID].content = pokemon.id || "";
            this.rawFields[FieldIds.Name].content = pokemon.name || "";
            this.rawFields[FieldIds.HP].content = pokemon.hp || "";
            this.rawFields[FieldIds.Type].content = pokemon.type || "";
            this.rawFields[FieldIds.Set].content = pokemon.set || "";
            this.rawFields[FieldIds.FlavorText].content =
                pokemon.flavorText || "";
        },
        setUserFromToken(token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                this.user = decoded;
            } catch (err) {
                console.error("Invalid JWT:", err);
            }
        },
        clearUser() {
            this.user = getNullUser();
            localStorage.removeItem("jwt_token");
        },
        finishAuthInit() {
            this.isAuthInitialized = true;
        },
    },
});
