import { ref } from "vue";

const isVisible = ref(false);
const message = ref({});
const currentPokemonData = ref({});

export function useConfirmDialog() {
    const openConfirmDialog = (header, messageText, data) => {
        message.value = { header, message: messageText };
        isVisible.value = true;
        console.log(isVisible.value);
        currentPokemonData.value = data;
    };

    const closeConfirmDialog = () => {
        isVisible.value = false;
    };

    return {
        isVisible,
        message,
        currentPokemonData,
        openConfirmDialog,
        closeConfirmDialog,
    };
}
