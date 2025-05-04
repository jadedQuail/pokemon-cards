<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="store.addPokemonDialogVisible"
            :draggable="false"
            modal
            :header="dialogHeader"
            class="min-w-[500px] !w-[30vw]"
            @hide="resetForm"
            @show="refreshCategories"
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <!-- Name -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label :for="FieldIds.Name" class="font-semibold w-24"
                    >Name</label
                >
                <div class="flex flex-col flex-auto">
                    <InputText
                        v-model="fields[FieldIds.Name].content"
                        :id="FieldIds.Name"
                        class="w-full"
                        autocomplete="off"
                        :invalid="!fields[FieldIds.Name].valid"
                        @update:model-value="
                            (value) =>
                                setValidityFlagForField(
                                    value,
                                    fields[FieldIds.Name]
                                )
                        "
                    />
                    <small
                        v-if="!fields[FieldIds.Name].valid"
                        class="text-red-500"
                    >
                        You must provide a name for this Pokemon card.
                    </small>
                </div>
            </div>
            <!-- HP -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label :for="FieldIds.HP" class="font-semibold w-24">HP</label>
                <div class="flex flex-col flex-auto">
                    <InputText
                        v-model="fields[FieldIds.HP].content"
                        :id="FieldIds.HP"
                        class="w-full"
                        autocomplete="off"
                        :invalid="!fields[FieldIds.HP].valid"
                        @update:model-value="
                            (value) =>
                                setValidityFlagForField(
                                    value,
                                    fields[FieldIds.HP]
                                )
                        "
                    />
                    <small
                        v-if="!fields[FieldIds.HP].valid"
                        class="text-red-500"
                    >
                        You must provide a <em>valid</em> HP value for this
                        Pokemon card.
                    </small>
                </div>
            </div>
            <!-- Type -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label :for="FieldIds.Type" class="font-semibold w-24"
                    >Type</label
                >
                <div class="flex flex-col flex-auto">
                    <Select
                        v-model="fields[FieldIds.Type].content"
                        :options="types"
                        placeholder=""
                        class="flex-auto"
                        :invalid="!fields[FieldIds.Type].valid"
                        @update:model-value="
                            (value) =>
                                setValidityFlagForField(
                                    value,
                                    fields[FieldIds.Type]
                                )
                        "
                    />
                    <small
                        v-if="!fields[FieldIds.Type].valid"
                        id="type-error"
                        class="text-red-500"
                    >
                        You must select a type for this Pokemon card.
                    </small>
                </div>
            </div>
            <!-- Set -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label :for="FieldIds.Set" class="font-semibold w-24"
                    >Set</label
                >
                <div class="flex flex-col flex-auto">
                    <Select
                        v-model="fields[FieldIds.Set].content"
                        :options="sets"
                        placeholder=""
                        class="flex-auto"
                        :invalid="!fields[FieldIds.Set].valid"
                        @update:model-value="
                            (value) =>
                                setValidityFlagForField(
                                    value,
                                    fields[FieldIds.Set]
                                )
                        "
                    />
                    <small
                        v-if="!fields[FieldIds.Set].valid"
                        class="text-red-500"
                    >
                        You must select a valid set for this Pokemon card.
                    </small>
                </div>
            </div>
            <!-- Flavor Text -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label :for="FieldIds.FlavorText" class="font-semibold w-24"
                    >Flavor Text</label
                >
                <div class="flex flex-col flex-auto">
                    <Textarea
                        v-model="fields[FieldIds.FlavorText].content"
                        rows="5"
                        cols="5"
                        class="flex-auto resize-none leading-snug"
                        :invalid="!fields[FieldIds.FlavorText].valid"
                        @update:model-value="
                            (value) =>
                                setValidityFlagForField(
                                    value,
                                    fields[FieldIds.FlavorText]
                                )
                        "
                    />
                    <small
                        v-if="!fields[FieldIds.FlavorText].valid"
                        class="text-red-500"
                    >
                        You must enter valid flavor text for this Pokemon card.
                    </small>
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="closeDialog"
                ></Button>
                <Button
                    type="button"
                    label="Save"
                    @click="handleSubmit"
                ></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { FieldIds, PokemonFormMode } from "~/static/constants.js";

import {
    addPokemon,
    editPokemon,
    getTypeOptions,
    getSetOptions,
} from "@/services/apiCalls";

import { useStore } from "~/store/store.js";

import { useToastNotifications } from "@/composables/useToastNotification";
import { SeverityLevels } from "~/static/constants.js";

const store = useStore();

const { showToast } = useToastNotifications();

const config = useRuntimeConfig();

const formData = ref({});

const types = ref([]);
const sets = ref([]);

const handleSubmit = async () => {
    setValidityFlagsForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        await submitPokemonHandler();
        closeDialog();
    }
};

const fields = ref(store.rawFields);

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
    if (field.name === FieldIds.HP) {
        if (value.length < 1 || !canBeConvertedToPositiveInt(value)) {
            field.valid = false;
        } else {
            field.valid = true;
        }
    } else if (field.name === FieldIds.ID) {
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

const loadTypeOptions = async () => {
    try {
        const apiUrl = config.public.API_URL;
        types.value = await getTypeOptions(apiUrl);
    } catch (error) {
        console.error(
            'Error fetching type options for "Add Pokemon" form:',
            error
        );
    }
};

const loadSetOptions = async () => {
    try {
        const apiUrl = config.public.API_URL;
        sets.value = await getSetOptions(apiUrl);
    } catch (error) {
        console.error(
            'Error fetching set options for "Add Pokemon" form:',
            error
        );
    }
};

const submitPokemonHandler = async () => {
    try {
        const apiUrl = config.public.API_URL;

        const cardNameForToast = fields.value.name.content;
        const cardHpForToast = fields.value.hp.content;
        const cardTypeForToast = fields.value.type.content;

        if (store.pokemonFormMode === PokemonFormMode.Add) {
            await addPokemon(apiUrl, fields.value);

            showToast(
                SeverityLevels.Info,
                "Card Created",
                `Created card: (${cardNameForToast}, ${cardHpForToast}, ${cardTypeForToast})`
            );
        } else if (store.pokemonFormMode === PokemonFormMode.Edit) {
            await editPokemon(apiUrl, fields.value, fields.value.id.content);

            showToast(
                SeverityLevels.Info,
                "Card Edit",
                `Edited card: (${cardNameForToast}, ${cardHpForToast}, ${cardTypeForToast})`
            );
        }

        await store.fetchPokemonData(apiUrl); // Fetch data after submitting
    } catch (error) {
        console.error("Error posting data:", error);
    }
};

const closeDialog = () => {
    store.hideAddPokemonDialog();
};

const dialogHeader = computed(() => {
    if (store.pokemonFormMode === PokemonFormMode.Edit) {
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
    await loadTypeOptions();
    await loadSetOptions();
};

onMounted(async () => {
    refreshCategories();
});
</script>
