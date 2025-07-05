import { ref } from "vue";
import type { ConfirmDialogMessage, PokemonData } from "~/types/all";

const isVisible = ref(false)
const message = ref<ConfirmDialogMessage>({ header: '', message: '' })
const currentPokemonData = ref<PokemonData | null>(null)

export function useConfirmDialog() {
    const openConfirmDialog = (
        header: string,
        messageText: string,
        data: PokemonData
    ): void => {
        message.value = { header, message: messageText };
        isVisible.value = true;
        currentPokemonData.value = data;
    };

    const closeConfirmDialog = (): void => {
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
