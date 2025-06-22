<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="categoryStore.categoriesDialogVisible"
            modal
            :draggable="false"
            @hide="closeDialog"
            class="min-w-[450px] !max-h-[500px]"
            :pt="{
                header: {
                    class: [
                        'flex items-center justify-between shrink-0',
                        'px-6 pt-6 pb-2',
                        'rounded-tl-lg rounded-tr-lg',
                        'text-surface-700 dark:text-surface-0/80',
                        'border border-b-0 border-surface-200 dark:border-surface-700',
                    ].join(' '),
                },
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <template #header>
                <div class="font-semibold text-xl leading-none">
                    {{ dialogHeaderPlural }}
                </div>
            </template>
            <form
                data-testid="categories-form"
                @submit.prevent="addCategoryConfirmation(newCategoryToAdd)"
            >
                <div class="mt-1 mb-5 space-x-2">
                    <InputText
                        type="text"
                        data-testid="new-category-input"
                        v-model="newCategoryToAdd"
                    />
                    <Button
                        type="submit"
                        :label="'Add ' + dialogHeaderSingular"
                    ></Button>
                    <Button
                        data-testid="remove-category-button"
                        type="button"
                        label="Remove Selected"
                        :disabled="removeCategoriesDisabled"
                        :severity="removeCategoriesDisabled ? null : 'danger'"
                        @click="removeCategoryConfirmation"
                    ></Button>
                </div>
                <div class="space-y-1">
                    <!-- Types -->
                    <div
                        v-if="
                            categoryStore.categoriesFormMode ===
                            CategoriesFormMode.Types
                        "
                    >
                        <div
                            v-for="type in categoryStore.types"
                            :key="type"
                            class="flex items-center gap-2"
                        >
                            <Checkbox
                                v-model="selectedCategories"
                                :inputId="type"
                                name="type"
                                :value="type"
                            />
                            <label :for="type">{{ type }}</label>
                        </div>
                    </div>
                    <!-- Sets -->
                    <div
                        v-else-if="
                            categoryStore.categoriesFormMode ===
                            CategoriesFormMode.Sets
                        "
                    >
                        <div
                            v-for="set in categoryStore.sets"
                            :key="set"
                            class="flex items-center gap-2"
                        >
                            <Checkbox
                                v-model="selectedCategories"
                                :inputId="set"
                                name="set"
                                :value="set"
                            />
                            <label :for="set">{{ set }}</label>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { usePokemonStore } from "~/stores/pokemonStore.js";
import { useCategoryStore } from "~/stores/categoryStore.js";
import { CategoriesFormMode } from "~/static/constants.js";
import { deleteType, addType } from "@/services/apiClient/type.js";
import { addSet, deleteSet } from "@/services/apiClient/set.js";

const config = useRuntimeConfig();
const pokemonStore = usePokemonStore();
const categoryStore = useCategoryStore();

const newCategoryToAdd = ref("");
const selectedCategories = ref([]);

const resetDialogInput = async () => {
    newCategoryToAdd.value = "";
    selectedCategories.value = [];
};

const closeDialog = async () => {
    await resetDialogInput();

    categoryStore.hideCategoriesDialog();
};

const dialogHeaderSingular = computed(() => {
    if (categoryStore.categoriesFormMode === CategoriesFormMode.Types) {
        return "Type";
    }
    return "Set";
});

const dialogHeaderPlural = computed(() => {
    if (categoryStore.categoriesFormMode === CategoriesFormMode.Types) {
        return "Types";
    }
    return "Sets";
});

const addCategoryConfirmation = async (categoryName) => {
    const userConfirmed = confirm(
        `Are you sure you would like to add this category?`
    );
    if (userConfirmed) {
        await addCategory(categoryName);
    }
};

const addCategory = async (categoryName) => {
    const apiUrl = config.public.API_URL;
    let result;

    if (categoryStore.categoriesFormMode === CategoriesFormMode.Types) {
        result = await addType(apiUrl, categoryName);
    } else {
        result = await addSet(apiUrl, categoryName);
    }

    if (!result.success) {
        alert(result.message);
        return;
    }

    await resetDialogInput();
    await categoryStore.refreshCategories(apiUrl);
    await pokemonStore.fetchPokemonData(apiUrl);
};

const removeCategoryConfirmation = async () => {
    const userConfirmed = confirm(
        `Are you sure you want to remove the selected categories?\n\nThis value will be replaced with 'null' for all Pokémon it is applicable to.`
    );
    if (userConfirmed) {
        await removeCategories();
    }
};

const removeCategories = async () => {
    const apiUrl = config.public.API_URL;

    if (categoryStore.categoriesFormMode === CategoriesFormMode.Types) {
        for (const category of selectedCategories.value) {
            await deleteType(apiUrl, category);
        }
    } else {
        for (const category of selectedCategories.value) {
            await deleteSet(apiUrl, category);
        }
    }

    await resetDialogInput();
    await categoryStore.refreshCategories(apiUrl);
    await pokemonStore.fetchPokemonData(apiUrl);
};

const removeCategoriesDisabled = computed(() => {
    return selectedCategories.value.length === 0;
});

onMounted(async () => {
    const apiUrl = config.public.API_URL;
    await categoryStore.refreshCategories(apiUrl);
});
</script>
