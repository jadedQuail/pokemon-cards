import { nextTick } from "vue";

export function useDialogTools() {
    // This function is to account for a bug where the X button on dialogs is auto-focused in PrimeVue
    // https://github.com/primefaces/primeng/issues/12643

    function clearFocus() {
        nextTick(() => {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
                active.blur();
            }
        });
    }

    return { clearFocus };
}
