import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";

import TopBar from "./TopBar.vue";
import { PokemonFormMode } from "~/static/constants.js";

vi.mock("~/stores/authStore.js", () => ({
    useAuthStore: () => ({
        user: { isAdmin: true },
        isLoggedIn: true,
        showLoginDialog: vi.fn(),
        showLogoutDialog: vi.fn(),
    }),
}));

const showAddPokemonDialogMock = vi.fn();
vi.mock("~/stores/pokemonStore.js", () => ({
    usePokemonStore: () => ({
        showAddPokemonDialog: showAddPokemonDialogMock,
    }),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

test("opens the Add Pokemon dialog when Add Pokemon button is clicked", async () => {
    await renderSuspended(TopBar);

    const addButton = screen.getByTestId("add-pokemon-button");
    await fireEvent.click(addButton);

    expect(showAddPokemonDialogMock).toHaveBeenCalledWith(PokemonFormMode.Add);
});
