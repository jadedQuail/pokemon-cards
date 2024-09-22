import { ref } from "vue";

const isVisible = ref(false);
const message = ref({});

export function useConfirmDialog() {
    const openConfirmDialog = (header, messageText) => {
        message.value = { header, message: messageText };
        isVisible.value = true;
        console.log(isVisible.value);
    };

    const closeConfirmDialog = () => {
        isVisible.value = false;
    };

    return {
        isVisible,
        message,
        openConfirmDialog,
        closeConfirmDialog,
    };
}
