import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";

let MainDataTable;
let pokemonDataMock;

const showAddPokemonDialogMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    pokemonDataMock = [
        {
            id: 1,
            name: "Bulbasaur",
            hp: 45,
            type: "Grass",
            set: "Base",
            flavorText: "Seed Pokémon",
        },
        {
            id: 2,
            name: "Charmander",
            hp: 39,
            type: "Fire",
            set: "Base",
            flavorText: "Lizard Pokémon",
        },
        {
            id: 3,
            name: "Axew",
            hp: 47,
            type: "Dragon",
            set: "Jungle",
            flavorText: "Axe Pokemon",
        },
    ];

    vi.doMock("~/stores/authStore.js", () => ({
        useAuthStore: () => ({ user: { isAdmin: true } }),
    }));

    vi.doMock("~/stores/pokemonStore.js", () => ({
        usePokemonStore: () => ({
            pokemonData: pokemonDataMock,
            showAddPokemonDialog: showAddPokemonDialogMock,
            fetchPokemonData: vi.fn(),
            setFieldContentForEditDialog: vi.fn(),
        }),
    }));

    const module = await import("~/components/MainDataTable.vue");
    MainDataTable = module.default;
});

test("shows pokemon in the table", async () => {
    await renderSuspended(MainDataTable);

    const cells = await screen.findAllByRole("cell");
    const rendered = cells.map((c) => c.textContent.trim());

    const expected = pokemonDataMock
        .flatMap((p) => Object.values(p))
        .map((v) => String(v));

    for (const val of expected) {
        expect(rendered).toContain(val);
    }
});

test("clicking the pencil icon on a row opens the edit dialog", async () => {
    await renderSuspended(MainDataTable);

    const editIcons = await screen.findAllByTestId("edit-icon");
    expect(editIcons.length).toBeGreaterThan(0);

    await fireEvent.click(editIcons[0]);

    expect(showAddPokemonDialogMock).toHaveBeenCalledTimes(1);
});
