import { defineStore } from "pinia";
import { getSetOptions } from "@/services/apiClient/set.js";
import { getTypeOptions } from "@/services/apiClient/type.js";
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
