<template>
    <div>
        <Button label="Test" />
    </div>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="computedVisible"
            :draggable="false"
            :dismissableMask="true"
            modal header="Add New Pokemon Card"
            class="min-w-[500px] !w-[30vw]"
        >
            <!-- Name -->
            <div class="flex items-center gap-4 mb-4 mt-1">
                <label for="name" class="font-semibold w-24">Name</label>
                <InputText id="name" class="flex-auto" autocomplete="off" />
            </div>
            <!-- HP -->
            <div class="flex items-center gap-4 mb-4">
                <label for="hp" class="font-semibold w-24">HP</label>
                <InputNumber inputId="integeronly" class="flex-auto" autocomplete="off" />
            </div>
            <!-- Type -->
            <div class="flex items-center gap-4 mb-4">
                <label for="type" class="font-semibold w-24">Type</label>
                <Select optionLabel="type" placeholder="" class="flex-auto" />
            </div>
            <!-- Set -->
            <div class="flex items-center gap-4 mb-4">
                <label for="set" class="font-semibold w-24">Set</label>
                <Select optionLabel="set" placeholder="" class="flex-auto" />
            </div>
            <!-- Flavor Text -->
            <div class="flex gap-4 mb-4">
                <label for="flavortext" class="font-semibold w-24 mt-1">Flavor Text</label>
                <Textarea rows="5" cols="5" class="flex-auto resize-none leading-snug" />
            </div>
            <!-- Buttons -->
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
                <Button type="button" label="Save" @click="closeDialog"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    }
});

const emit = defineEmits(['closing-dialog']);

const computedVisible = computed({
    get() {
        return props.visible;
    },
    set(value) {
        emit('closing-dialog', value);
    }
});

const closeDialog = () => {
    computedVisible.value = false;
}
</script>