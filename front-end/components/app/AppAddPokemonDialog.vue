<template>
    <div>
        <Button label="Test" />
    </div>
    <div class="flex justify-center">
        <!-- TODO: Figure out why this pcCloseButton pass through doesn't work (I think PrimeVue v4 is broken) -->
        <Dialog
            v-model:visible="visibilityController"
            :draggable="false"
            modal
            header="Add New Pokemon Card"
            class="min-w-[500px] !w-[30vw]"
            @hide="resetValidationFlags"
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
                            (value) => revalidate(value, fields[FieldIds.Name])
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
                            (value) => revalidate(value, fields[FieldIds.HP])
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
                            (value) => revalidate(value, fields[FieldIds.Type])
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
                            (value) => revalidate(value, fields[FieldIds.Set])
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
                                revalidate(value, fields[FieldIds.FlavorText])
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
import { defineProps, defineEmits, onMounted } from "vue";
import { FieldIds } from "~/static/constants.js";
let axios;
const config = useRuntimeConfig();

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["closing-dialog"]);

const formData = ref({});

const types = ref([]);
const sets = ref([]);

import { useStore } from "~/store/store.js";

const store = useStore();

// The visibility prop determines whether the dialog is active or not, visibilityController puts it in effect
const visibilityController = computed({
    get() {
        return props.visible;
    },
    set(value) {
        emit("closing-dialog", value);
    },
});

const handleSubmit = async () => {
    const formReady = validateForm();

    if (formReady) {
        await submitPokemon();
        closeDialog();
    }
};

const fields = ref({
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
});

const resetValidationFlags = () => {
    for (const key in fields.value) {
        if (fields.value.hasOwnProperty(key)) {
            fields.value[key].valid = true;
        }
    }
};

const revalidate = (value, field) => {
    if (field.name === FieldIds.HP) {
        if (value.length < 1 || !canBeConvertedToPositiveInt(value)) {
            field.valid = false;
        } else {
            field.valid = true;
        }
    } else {
        if (value.length < 1) {
            field.valid = false;
        } else {
            field.valid = true;
        }
    }
};

const validateForm = () => {
    let allValid = true;

    for (const key in fields.value) {
        if (fields.value[key].content === "") {
            fields.value[key].valid = false;
            allValid = false;
        }
    }

    return allValid;
};

const getTypeOptions = async () => {
    try {
        axios = (await import("axios")).default;
        const response = await axios.get(
            config.public.API_URL + "/get-type-options"
        );
        types.value = response.data;
    } catch (error) {
        console.error(
            'Error fetching type options for "Add Pokemon" form:',
            error
        );
    }
};

const getSetOptions = async () => {
    try {
        axios = (await import("axios")).default;
        const response = await axios.get(
            config.public.API_URL + "/get-set-options"
        );
        sets.value = response.data;
    } catch (error) {
        console.error(
            'Error fetching set options for "Add Pokemon" form:',
            error
        );
    }
};

const submitPokemon = async () => {
    try {
        const dataToSend = {
            pokemonName: fields.value.name.content,
            pokemonHP: fields.value.hp.content,
            pokemonFlavorText: fields.value.flavorText.content,
            pokemonType: fields.value.type.content,
            pokemonSet: fields.value.set.content,
        };
        const response = await axios.post(
            `${config.public.API_URL}/add-pokemon`,
            dataToSend,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        await store.fetchPokemonData(config.public.API_URL);
    } catch (error) {
        console.error("Error posting data:", error);
    }
};

const closeDialog = () => {
    visibilityController.value = false;
};

function canBeConvertedToPositiveInt(str) {
    const trimmedStr = str.trim();
    const isInteger = /^-?\d+$/.test(trimmedStr);
    const hasLeadingZeros = /^0+/.test(trimmedStr) && trimmedStr !== "0";
    const parsedInt = parseInt(trimmedStr, 10);

    return isInteger && !isNaN(parsedInt) && parsedInt > 0 && !hasLeadingZeros;
}

onMounted(async () => {
    getTypeOptions();
    getSetOptions();
});

// TODO: Best way to register a new set or type?
</script>
