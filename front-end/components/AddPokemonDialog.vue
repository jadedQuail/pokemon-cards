<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="pokemonStore.addPokemonDialogVisible"
            :draggable="false"
            modal
            :header="dialogHeader"
            class="min-w-[500px] !w-[30vw]"
            @hide="resetForm"
            @show="
                () => {
                    dialogTools.clearFocus();
                    refreshCategories();
                }
            "
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <form data-testid="add-pokemon-form" @submit.prevent="handleSubmit">
                <!-- Name -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label
                        :for="AddPokemonFieldIds.Name"
                        class="font-semibold w-24"
                        >Name</label
                    >
                    <div class="flex flex-col flex-auto">
                        <InputText
                            data-testid="pokemon-name"
                            v-model="fields[AddPokemonFieldIds.Name].content"
                            :id="AddPokemonFieldIds.Name"
                            class="w-full"
                            autocomplete="off"
                            :invalid="!fields[AddPokemonFieldIds.Name].valid"
                            @update:model-value="
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[AddPokemonFieldIds.Name]
                                    )
                            "
                        />
                        <small
                            v-if="!fields[AddPokemonFieldIds.Name].valid"
                            class="text-red-500"
                        >
                            You must provide a name for this Pokemon card.
                        </small>
                    </div>
                </div>
                <!-- HP -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label
                        :for="AddPokemonFieldIds.HP"
                        class="font-semibold w-24"
                        >HP</label
                    >
                    <div class="flex flex-col flex-auto">
                        <InputText
                            data-testid="pokemon-hp"
                            v-model="fields[AddPokemonFieldIds.HP].content"
                            :id="AddPokemonFieldIds.HP"
                            class="w-full"
                            autocomplete="off"
                            :invalid="!fields[AddPokemonFieldIds.HP].valid"
                            @update:model-value="
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[AddPokemonFieldIds.HP]
                                    )
                            "
                        />
                        <small
                            v-if="!fields[AddPokemonFieldIds.HP].valid"
                            class="text-red-500"
                        >
                            You must provide a <em>valid</em> HP value for this
                            Pokemon card.
                        </small>
                    </div>
                </div>
                <!-- Type -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label
                        :for="AddPokemonFieldIds.Type"
                        class="font-semibold w-24"
                        >Type</label
                    >
                    <div class="flex flex-col flex-auto">
                        <Select
                            data-testid="pokemon-type"
                            v-model="fields[AddPokemonFieldIds.Type].content"
                            :options="categoryStore.types"
                            placeholder=""
                            class="flex-auto"
                            :invalid="!fields[AddPokemonFieldIds.Type].valid"
                            @update:model-value="
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[AddPokemonFieldIds.Type]
                                    )
                            "
                        />
                        <small
                            v-if="!fields[AddPokemonFieldIds.Type].valid"
                            id="type-error"
                            class="text-red-500"
                        >
                            You must select a type for this Pokemon card.
                        </small>
                    </div>
                </div>
                <!-- Set -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label
                        :for="AddPokemonFieldIds.Set"
                        class="font-semibold w-24"
                        >Set</label
                    >
                    <div class="flex flex-col flex-auto">
                        <Select
                            data-testid="pokemon-set"
                            v-model="fields[AddPokemonFieldIds.Set].content"
                            :options="categoryStore.sets"
                            placeholder=""
                            class="flex-auto"
                            :invalid="!fields[AddPokemonFieldIds.Set].valid"
                            @update:model-value="
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[AddPokemonFieldIds.Set]
                                    )
                            "
                        />
                        <small
                            v-if="!fields[AddPokemonFieldIds.Set].valid"
                            class="text-red-500"
                        >
                            You must select a valid set for this Pokemon card.
                        </small>
                    </div>
                </div>
                <!-- Flavor Text -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label
                        :for="AddPokemonFieldIds.FlavorText"
                        class="font-semibold w-24"
                        >Flavor Text</label
                    >
                    <div class="flex flex-col flex-auto">
                        <Textarea
                            data-testid="pokemon-flavortext"
                            v-model="
                                fields[AddPokemonFieldIds.FlavorText].content
                            "
                            rows="5"
                            cols="5"
                            class="flex-auto resize-none leading-snug"
                            :invalid="
                                !fields[AddPokemonFieldIds.FlavorText].valid
                            "
                            @update:model-value="
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[AddPokemonFieldIds.FlavorText]
                                    )
                            "
                        />
                        <small
                            v-if="!fields[AddPokemonFieldIds.FlavorText].valid"
                            class="text-red-500"
                        >
                            You must enter valid flavor text for this Pokemon
                            card.
                        </small>
                    </div>
                </div>
                <!-- Buttons -->
                <div class="flex justify-end gap-2">
                    <Button
                        data-testid="cancel-add-pokemon-button"
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="closeDialog"
                    ></Button>
                    <Button type="submit" label="Save"></Button>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { AddPokemonFieldIds, PokemonFormMode } from "~/static/constants.js";

import { addPokemon, editPokemon } from "@/services/apiClient/pokemon.js";
import { getTypeOptions } from "@/services/apiClient/type.js";
import { getSetOptions } from "@/services/apiClient/set.js";

import { usePokemonStore } from "~/stores/pokemonStore.js";
import { useCategoryStore } from "~/stores/categoryStore.js";
import { useDialogTools } from "~/composables/useDialogTools.js";

import { useToastNotifications } from "@/composables/useToastNotification";
import { SeverityLevels } from "~/static/constants.js";

const dialogTools = useDialogTools();

const pokemonStore = usePokemonStore();
const categoryStore = useCategoryStore();

const { showToast } = useToastNotifications();

const config = useRuntimeConfig();

const handleSubmit = async () => {
    setValidityFlagsForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        await submitPokemonHandler();
        closeDialog();
    }
};

const fields = ref(pokemonStore.addPokemonFields);

const resetForm = () => {
    resetValidationFlags();
    resetFieldContent();
};

const resetValidationFlags = () => {
    for (const key in fields.value) {
        if (fields.value.hasOwnProperty(key)) {
            fields.value[key].valid = true;
        }
    }
};

const resetFieldContent = () => {
    for (const key in fields.value) {
        if (fields.value.hasOwnProperty(key)) {
            fields.value[key].content = "";
        }
    }
};

const setValidityFlagForField = (value, field) => {
    if (field.name === AddPokemonFieldIds.HP) {
        if (value.length < 1 || !canBeConvertedToPositiveInt(value)) {
            field.valid = false;
        } else {
            field.valid = true;
        }
    } else if (field.name === AddPokemonFieldIds.ID) {
        field.value = true;
    } else {
        if (value.length < 1) {
            field.valid = false;
        } else {
            field.valid = true;
        }
    }
};

const areAllFieldsValid = () => {
    for (const key in fields.value) {
        if (fields.value[key].valid === false) {
            return false;
        }
    }

    return true;
};

const submitPokemonHandler = async () => {
    try {
        const apiUrl = config.public.API_URL;

        const cardNameForToast = fields.value.name.content;
        const cardHpForToast = fields.value.hp.content;
        const cardTypeForToast = fields.value.type.content;

        if (pokemonStore.pokemonFormMode === PokemonFormMode.Add) {
            await addPokemon(apiUrl, fields.value);

            showToast(
                SeverityLevels.Info,
                "Card Created",
                `Created card: (${cardNameForToast}, ${cardHpForToast}, ${cardTypeForToast})`
            );
        } else if (pokemonStore.pokemonFormMode === PokemonFormMode.Edit) {
            await editPokemon(apiUrl, fields.value, fields.value.id.content);

            showToast(
                SeverityLevels.Info,
                "Card Edit",
                `Edited card: (${cardNameForToast}, ${cardHpForToast}, ${cardTypeForToast})`
            );
        }

        await pokemonStore.fetchPokemonData(apiUrl); // Fetch data after submitting
    } catch (error) {
        console.error("Error posting data:", error);
    }
};

const closeDialog = () => {
    pokemonStore.hideAddPokemonDialog();
};

const dialogHeader = computed(() => {
    if (pokemonStore.pokemonFormMode === PokemonFormMode.Edit) {
        return "Edit Pokemon Card";
    }
    return "Add Pokemon Card";
});

function canBeConvertedToPositiveInt(str) {
    const trimmedStr = str.trim();
    const isInteger = /^-?\d+$/.test(trimmedStr);
    const hasLeadingZeros = /^0+/.test(trimmedStr) && trimmedStr !== "0";
    const parsedInt = parseInt(trimmedStr, 10);

    return isInteger && !isNaN(parsedInt) && parsedInt > 0 && !hasLeadingZeros;
}

const setValidityFlagsForAllFields = () => {
    for (const key in fields.value) {
        const field = fields.value[key];
        setValidityFlagForField(field.content, field);
    }
};

const refreshCategories = async () => {
    const apiUrl = config.public.API_URL;

    await categoryStore.refreshCategories(apiUrl);
};

onMounted(async () => {
    await refreshCategories();
});
</script>
