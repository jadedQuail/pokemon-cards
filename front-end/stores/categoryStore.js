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
        async loadTypeOptions() {
            try {
                this.types = await getTypeOptions();
            } catch (error) {
                console.error("Error fetching type options:", error);
            }
        },
        async loadSetOptions() {
            try {
                this.sets = await getSetOptions();
            } catch (error) {
                console.error("Error fetching set options:", error);
            }
        },
        async refreshCategories() {
            await this.loadTypeOptions();
            await this.loadSetOptions();
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
