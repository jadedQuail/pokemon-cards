import { defineStore } from "pinia";
import { getSetOptions, addSet, deleteSet } from "@/services/apiClient/set.js";
import {
    getTypeOptions,
    addType,
    deleteType,
} from "@/services/apiClient/type.js";
import { CategoriesFormMode } from "~/static/constants.js";

export const useCategoryStore = defineStore("category", {
    state: () => ({
        categoriesDialogVisible: false,
        categoriesFormMode: CategoriesFormMode.None,
        types: [],
        sets: [],
    }),

    actions: {
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
        // TODO - this not being used?
        async addCategory(apiUrl, categoryName) {
            if (this.categoriesFormMode === CategoriesFormMode.Types) {
                await addType(apiUrl, categoryName);
            } else {
                await addSet(apiUrl, categoryName);
            }
            await this.refreshCategories(apiUrl);
        },
        // TODO - this also not being used?
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
        },
        async refreshCategories(apiUrl) {
            await this.loadTypeOptions(apiUrl);
            await this.loadSetOptions(apiUrl);
        },
        showCategoriesDialog(formMode) {
            this.categoriesFormMode = formMode;
            this.categoriesDialogVisible = true;
        },
        hideCategoriesDialog() {
            this.categoriesDialogVisible = false;
            this.categoriesFormMode = CategoriesFormMode.None;
        },
    },
});
