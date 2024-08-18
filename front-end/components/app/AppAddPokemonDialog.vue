<template>
    <div>
        <Button label="Test" />
    </div>
    <div class="flex justify-center">
        <Dialog v-model:visible="computedVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Username</label>
                <InputText id="username" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Email</label>
                <InputText id="email" class="flex-auto" autocomplete="off" />
            </div>
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