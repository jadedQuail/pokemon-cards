import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";

import { SeverityLevels } from "~/static/constants.js";

let ConfirmDeletionDialog;
let isVisible;

const showToastMock = vi.fn();
const deletePokemonMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    isVisible = ref(true);

    vi.doMock("~/composables/useToastNotification", () => ({
        useToastNotifications: () => ({
            showToast: showToastMock,
        }),
    }));

    vi.doMock("~/composables/useConfirmDialog", () => ({
        useConfirmDialog: () => ({
            isVisible: isVisible,
            message: ref({}),
            currentPokemonData: ref({}),
        }),
    }));

    vi.doMock("@/services/apiClient/pokemon.js", () => ({
        deletePokemon: deletePokemonMock,
    }));

    const module = await import("~/components/ConfirmDeletionDialog.vue");
    ConfirmDeletionDialog = module.default;
});

test("calls the API client function to delete the pokemon upon deletion", async () => {
    await renderSuspended(ConfirmDeletionDialog);

    expect(isVisible.value).toEqual(true);

    const deleteButton = screen.getByTestId("delete-pokemon-button");
    await fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(deletePokemonMock).toHaveBeenCalledTimes(1);
        expect(showToastMock).toHaveBeenCalledWith(
            SeverityLevels.Info,
            "Card Deleted",
            expect.stringContaining("Deleted card with ID:")
        );
        expect(isVisible.value).toEqual(false);
    });
});

test("hides the confirm deletion dialog when the Cancel button is clicked", async () => {
    await renderSuspended(ConfirmDeletionDialog);

    expect(isVisible.value).toEqual(true);

    const cancelButton = screen.getByTestId("cancel-delete-pokemon-button");
    await fireEvent.click(cancelButton);

    expect(isVisible.value).toEqual(false);
});
