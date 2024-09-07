<template>
    <div>
        <Button label="Test" />
    </div>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="visibilityController"
            :draggable="false"
            modal
            header="Add New Pokemon Card"
            class="min-w-[500px] !w-[30vw]"
            @hide="resetValidationFlags"
        >
            <!-- Name -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="name" class="font-semibold w-24">Name</label>
                <div class="flex flex-col flex-auto">
                    <InputText
                        v-model="fields.name.content"
                        id="name"
                        class="w-full"
                        autocomplete="off" 
                        aria-describedby="name-error"
                        :invalid="!fields.name.valid"
                        @update:model-value="(value) => revalidate(value, fields.name)"
                    />
                    <small v-if="!fields.name.valid" id="name-error" class="text-red-500">You must provide a name for this Pokemon card.</small>
                </div>
            </div>
            <!-- HP -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="hp" class="font-semibold w-24">HP</label>
                <div class="flex flex-col flex-auto">
                    <InputText
                        v-model="fields.hp.content"
                        id="hp"
                        class="w-full"
                        autocomplete="off"
                        aria-describedby="hp-error"
                        :invalid="!fields.hp.valid"
                        @update:model-value="(value) => revalidate(value, fields.hp)"
                    />
                    <small v-if="!fields.hp.valid" id="hp-error" class="text-red-500">You must provide an HP value for this Pokemon card.</small>
                </div>
            </div>
            <!-- Type -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="type" class="font-semibold w-24">Type</label>
                <div class="flex flex-col flex-auto">
                    <Select
                        v-model="fields.type.content"
                        :options="types"
                        placeholder=""
                        class="flex-auto"
                        aria-describedby="type-error"
                        :invalid="!fields.type.valid"
                        @update:model-value="(value) => revalidate(value, fields.type)"
                    />
                    <small v-if="!fields.type.valid" id="type-error" class="text-red-500">You must select a type for this Pokemon card.</small>
                </div>
            </div>
            <!-- Set -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="set" class="font-semibold w-24">Set</label>
                <div class="flex flex-col flex-auto">
                    <Select
                        v-model="fields.set.content"
                        :options="sets"
                        placeholder=""
                        class="flex-auto"
                        aria-describedby="set-error"
                        :invalid="!fields.set.valid"
                        @update:model-value="(value) => revalidate(value, fields.set)"
                    />
                    <small v-if="!fields.set.valid" id="set-error" class="text-red-500">You must select a valid set for this Pokemon card.</small>
                </div>
            </div>
            <!-- Flavor Text -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="flavortext" class="font-semibold w-24">Flavor Text</label>
                <div class="flex flex-col flex-auto">
                    <Textarea
                        v-model="fields.flavorText.content"
                        rows="5"
                        cols="5"
                        class="flex-auto resize-none leading-snug"
                        aria-describedby="flavortext-error"
                        :invalid="!fields.flavorText.valid"
                        @update:model-value="(value) => revalidate(value, fields.flavorText)"
                    />
                    <small v-if="!fields.flavorText.valid" id="flavortext-error" class="text-red-500">You must enter valid flavor text for this Pokemon card.</small>
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
                <Button type="button" label="Save" @click="handleSubmit"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';
let axios;
const config = useRuntimeConfig();

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    }
});

const emit = defineEmits(['closing-dialog']);

const formData = ref({});

const types = ref([]);
const sets = ref([]);

// The visibility prop determines whether the dialog is active or not, visibilityController puts it in effect
const visibilityController = computed({
    get() {
        return props.visible;
    },
    set(value) {
        emit('closing-dialog', value);
    }
});

const handleSubmit = async () => {
    const formReady = validateForm();

    if (formReady) {
        await submitPokemon();
        closeDialog();
    }
}

const fields = ref({
    name: {
        id: "name",
        content: "",
        valid: true,
    },
    hp: {
        id: "hp",
        content: "",
        valid: true,
    },
    type: {
        id: "type",
        content: "",
        valid: true,
    },
    set: {
        id: "set",
        content: "",
        valid: true,
    },
    flavorText: {
        id: "flavorText",
        content: "",
        valid: true,
    }
});

const resetValidationFlags = () => {
    for (const key in fields.value) {
        if (fields.value.hasOwnProperty(key)) {
            fields.value[key].valid = true;
        }
    }
}

const revalidate = (value, field) => {
    // TODO: Get rid of this magic string
    if (field.id === "hp") {
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
}

const validateForm = () => {
    let allValid = true;

    for (const key in fields.value) {
        if (fields.value[key].content === "") {
            fields.value[key].valid = false;
            allValid = false;
        }
    }

    return allValid;
}

const getTypeOptions = async() => {
    try {
        axios = (await import('axios')).default;
        const response = await axios.get(config.public.API_URL + '/get-type-options');
        types.value = response.data;
    } catch (error) {
        console.error('Error fetching type options for "Add Pokemon" form:', error)
    }
}

const getSetOptions = async() => {
    try {
        axios = (await import('axios')).default;
        const response = await axios.get(config.public.API_URL + '/get-set-options');
        sets.value = response.data;
    } catch (error) {
        console.error('Error fetching set options for "Add Pokemon" form:', error)
    }
}

const submitPokemon = async() => {
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
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

const closeDialog = () => {
    visibilityController.value = false;
}

function canBeConvertedToPositiveInt(str) {
    const trimmedStr = str.trim();
    const isInteger = /^-?\d+$/.test(trimmedStr);
    const hasLeadingZeros = /^0+/.test(trimmedStr) && trimmedStr !== '0';
    const parsedInt = parseInt(trimmedStr, 10);
    
    return isInteger && !isNaN(parsedInt) && parsedInt > 0 && !hasLeadingZeros;
}

onMounted(async () => {
    getTypeOptions();
    getSetOptions();
});

// TODO: Best way to register a new set or type?
</script>