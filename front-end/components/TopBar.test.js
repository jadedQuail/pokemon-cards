import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent, queryAllByAttribute } from "@testing-library/vue";
import "@testing-library/jest-dom";

import TopBar from "./TopBar.vue";
import { PokemonFormMode, CategoriesFormMode } from "~/static/constants.js";
import { FilterMatchMode } from "@primevue/core/api";

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

const showCategoriesDialogMock = vi.fn();
vi.mock("~/stores/categoryStore.js", () => ({
    useCategoryStore: () => ({
        showCategoriesDialog: showCategoriesDialogMock,
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

test("opens the Categories dialog when the Edit Types button is clicked", async () => {
    await renderSuspended(TopBar, {
        global: {
            stubs: { teleport: true },
        },
    });

    const dropdownButton = screen
        .getByTestId("dropdown-button")
        .closest("button");
    await fireEvent.click(dropdownButton);

    const editTypes = await screen.findByText("Edit Types");
    await fireEvent.click(editTypes);

    expect(showCategoriesDialogMock).toHaveBeenCalledWith(
        CategoriesFormMode.Types
    );
});

test("opens the Categories dialog when the Edit Sets button is clicked", async () => {
    await renderSuspended(TopBar, {
        global: {
            stubs: { teleport: true },
        },
    });

    const dropdownButton = screen
        .getByTestId("dropdown-button")
        .closest("button");
    await fireEvent.click(dropdownButton);

    const editSets = await screen.findByText("Edit Sets");
    await fireEvent.click(editSets);

    expect(showCategoriesDialogMock).toHaveBeenCalledWith(
        CategoriesFormMode.Sets
    );
});

test("Emits a search-change when new text is entered into the search box", async () => {
    const { emitted } = await renderSuspended(TopBar);

    const searchInput = screen.getByTestId("search-input");
    await fireEvent.update(searchInput, "pikachu");

    const calls = emitted()["search-change"];

    expect(calls).toHaveLength(1);

    expect(calls[0]).toEqual([
        { global: { value: "pikachu", matchMode: FilterMatchMode.CONTAINS } },
    ]);

    console.log(calls[0]);
});
