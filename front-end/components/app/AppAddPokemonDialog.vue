<template>
    <div>
        <Button label="Test" />
    </div>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="visibilityController"
            :draggable="false"
            modal header="Add New Pokemon Card"
            class="min-w-[500px] !w-[30vw]"
        >
            <!-- Name -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="name" class="font-semibold w-24">Name</label>
                <div class="flex flex-col flex-auto">
                    <InputText
                        v-model="formData.pokemonName"
                        id="name"
                        class="w-full"
                        autocomplete="off" 
                        aria-describedby="name-error"
                        :invalid="!nameValid"
                        @update:modelValue="resetValidityFlag(ValidityFlag.Name)"
                    />
                    <small v-if="!nameValid" id="name-error" class="text-red-500">You must provide a name for this Pokemon card.</small>
                </div>
            </div>
            <!-- HP -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="hp" class="font-semibold w-24">HP</label>
                <div class="flex flex-col flex-auto">
                    <InputNumber
                        v-model="formData.pokemonHP"
                        inputId="integeronly"
                        class="flex-auto"
                        autocomplete="off"
                        aria-describedby="hp-error"
                        :invalid="!hpValid"
                    />
                    <small v-if="!hpValid" id="hp-error" class="text-red-500">You must provide an HP value for this Pokemon card.</small>
                </div>
            </div>
            <!-- Type -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="type" class="font-semibold w-24">Type</label>
                <div class="flex flex-col flex-auto">
                    <Select
                        v-model="formData.pokemonType"
                        :options="types"
                        placeholder=""
                        class="flex-auto"
                        aria-describedby="type-error"
                        :invalid="!typeValid"
                    />
                    <small v-if="!typeValid" id="type-error" class="text-red-500">You must select a type for this Pokemon card.</small>
                </div>
            </div>
            <!-- Set -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="set" class="font-semibold w-24">Set</label>
                <div class="flex flex-col flex-auto">
                    <Select
                        v-model="formData.pokemonSet"
                        :options="sets"
                        placeholder=""
                        class="flex-auto"
                        aria-describedby="set-error"
                        :invalid="!setValid"
                    />
                    <small v-if="!setValid" id="set-error" class="text-red-500">You must select a valid set for this Pokemon card.</small>
                </div>
            </div>
            <!-- Flavor Text -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label for="flavortext" class="font-semibold w-24">Flavor Text</label>
                <div class="flex flex-col flex-auto">
                    <Textarea
                        v-model="formData.pokemonFlavorText"
                        rows="5"
                        cols="5"
                        class="flex-auto resize-none leading-snug"
                        aria-describedby="flavortext-error"
                        :invalid="!flavorTextValid"
                    />
                    <small v-if="!flavorTextValid" id="flavortext-error" class="text-red-500">You must enter valid flavor text for this Pokemon card.</small>
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
        resetValidityFlags();
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

// Form validation flags
const nameValid = ref(true);
const hpValid = ref(true);
const typeValid = ref(true);
const setValid = ref(true);
const flavorTextValid = ref(true);

const validateForm = () => {

    if (!('pokemonName' in formData.value) || !formData.value.pokemonName) {
        nameValid.value = false;
    } 
    if (!('pokemonHP' in formData.value) || !formData.value.pokemonHP) {
        hpValid.value = false;
    }
    if (!('pokemonType' in formData.value) || formData.value.pokemonType === '') {
        typeValid.value = false;
    }
    if (!('pokemonSet' in formData.value) || formData.value.pokemonSet === '') {
        setValid.value = false;
    }
    if (!('pokemonFlavorText' in formData.value) || formData.value.pokemonFlavorText === '') {
        flavorTextValid.value = false;
    }

    if (
        !nameValid.value || 
        !hpValid.value ||
        !typeValid.value ||
        !setValid.value ||
        !flavorTextValid.value
    ) {
        return false;
    }

    return true;
}

// API Calls
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
        const dataToSend = { ...formData.value };
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

const ValidityFlag = {
    Name: 'name',
    HP: 'hp',
    Type: 'type',
    Set: 'set',
    FlavorText: 'flavorText',
}

const resetValidityFlags = () => {
    nameValid.value = hpValid.value = typeValid.value = setValid.value = flavorTextValid.value = true;
}

const resetValidityFlag = (flag) => {
    if (flag === ValidityFlag.Name) {
        if (formData.value.pokemonName) {
            nameValid.value = true;
        } else {
            nameValid.value = false;
        }
    }
}

onMounted(async () => {
    getTypeOptions();
    getSetOptions();
});
</script>