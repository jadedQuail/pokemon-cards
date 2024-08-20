<template>
    <div>
        <Button label="Test" />
    </div>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="visibilityController"
            :draggable="false"
            :dismissableMask="true"
            modal header="Add New Pokemon Card"
            class="min-w-[500px] !w-[30vw]"
        >
            <!-- Name -->
            <div class="flex items-center gap-4 mb-4 mt-1">
                <label for="name" class="font-semibold w-24">Name</label>
                <InputText v-model="formData.pokemonName" id="name" class="flex-auto" autocomplete="off" />
            </div>
            <!-- HP -->
            <div class="flex items-center gap-4 mb-4">
                <label for="hp" class="font-semibold w-24">HP</label>
                <InputNumber v-model="formData.pokemonHP" inputId="integeronly" class="flex-auto" autocomplete="off" />
            </div>
            <!-- Type -->
            <div class="flex items-center gap-4 mb-4">
                <label for="type" class="font-semibold w-24">Type</label>
                <Select v-model="formData.pokemonType" :options="types" placeholder="" class="flex-auto" />
            </div>
            <!-- Set -->
            <div class="flex items-center gap-4 mb-4">
                <label for="set" class="font-semibold w-24">Set</label>
                <Select v-model="formData.pokemonSet" :options="sets" placeholder="" class="flex-auto" />
            </div>
            <!-- Flavor Text -->
            <div class="flex gap-4 mb-4">
                <label for="flavortext" class="font-semibold w-24 mt-1">Flavor Text</label>
                <Textarea v-model="formData.pokemonFlavorText" rows="5" cols="5" class="flex-auto resize-none leading-snug" />
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
    await submitPokemon();
    closeDialog();
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

onMounted(async () => {
    getTypeOptions();
    getSetOptions();
});
</script>