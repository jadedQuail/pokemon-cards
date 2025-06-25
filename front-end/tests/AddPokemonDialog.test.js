import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { within } from "@testing-library/vue";
import { screen, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";

import { AddPokemonFieldIds, PokemonFormMode } from "~/static/constants.js";
import { SeverityLevels } from "~/static/constants.js";

let AddPokemonDialog;
let pokemonFormModeMock;
let types;
let sets;
let addPokemonFieldsMock;

const showToastMock = vi.fn();
const hideAddPokemonDialogMock = vi.fn();
const fetchPokemonDataMock = vi.fn();
const addPokemonMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    pokemonFormModeMock = PokemonFormMode.Add;

    types = ["Fire", "Water", "Grass"];
    sets = ["Jungle", "Base", "Fossil"];

    addPokemonFieldsMock = {
        [AddPokemonFieldIds.Name]: {
            content: "Charmander",
            valid: true,
            name: AddPokemonFieldIds.Name,
        },
        [AddPokemonFieldIds.HP]: {
            content: "50",
            valid: true,
            name: AddPokemonFieldIds.HP,
        },
        [AddPokemonFieldIds.Type]: {
            content: "Fire",
            valid: true,
            name: AddPokemonFieldIds.Type,
        },
        [AddPokemonFieldIds.Set]: {
            content: "Jungle",
            valid: true,
            name: AddPokemonFieldIds.Set,
        },
        [AddPokemonFieldIds.FlavorText]: {
            content: "Obviously prefers hot places.",
            valid: true,
            name: AddPokemonFieldIds.FlavorText,
        },
    };

    vi.doMock("~/stores/categoryStore.js", () => ({
        useCategoryStore: () => ({
            types: types,
            sets: sets,
            refreshCategories: vi.fn(),
        }),
    }));

    vi.doMock("~/composables/useToastNotification", () => ({
        useToastNotifications: () => ({
            showToast: showToastMock,
        }),
    }));

    vi.doMock("~/stores/pokemonStore.js", () => ({
        usePokemonStore: () => ({
            addPokemonDialogVisible: true,
            hideAddPokemonDialog: hideAddPokemonDialogMock,
            fetchPokemonData: fetchPokemonDataMock,
            addPokemonFields: addPokemonFieldsMock,
            pokemonFormMode: pokemonFormModeMock,
        }),
    }));

    vi.doMock("@/services/apiClient/pokemon.js", () => ({
        addPokemon: addPokemonMock,
    }));

    const module = await import("~/components/AddPokemonDialog.vue");
    AddPokemonDialog = module.default;
});

test("hides the add pokemon dialog when the Cancel button is clicked", async () => {
    await renderSuspended(AddPokemonDialog);

    const cancelButton = screen.getByTestId("cancel-add-pokemon-button");
    await fireEvent.click(cancelButton);

    expect(hideAddPokemonDialogMock).toHaveBeenCalledTimes(1);
});

test("form does not submit when a required field is blank", async () => {
    addPokemonFieldsMock[AddPokemonFieldIds.Name].content = "";

    await renderSuspended(AddPokemonDialog);

    const addPokemonForm = screen.getByTestId("add-pokemon-form");
    await fireEvent.submit(addPokemonForm);

    expect(addPokemonMock).not.toHaveBeenCalled();
    expect(hideAddPokemonDialogMock).not.toHaveBeenCalled();
    expect(showToastMock).not.toHaveBeenCalled();
});

test("pre-fills form fields when the dialog is opened in Edit mode", async () => {
    pokemonFormModeMock = PokemonFormMode.Edit;

    await renderSuspended(AddPokemonDialog);

    const pokemonNameInput = screen.getByTestId("pokemon-name");
    expect(pokemonNameInput).toHaveValue(
        addPokemonFieldsMock[AddPokemonFieldIds.Name].content
    );

    const pokemonHpInput = screen.getByTestId("pokemon-hp");
    expect(pokemonHpInput).toHaveValue(
        addPokemonFieldsMock[AddPokemonFieldIds.HP].content
    );

    const pokemonTypeWrapper = screen.getByTestId("pokemon-type");
    expect(
        within(pokemonTypeWrapper).getByText(
            addPokemonFieldsMock[AddPokemonFieldIds.Type].content
        )
    ).toBeInTheDocument();

    const pokemonSetWrapper = screen.getByTestId("pokemon-set");
    expect(
        within(pokemonSetWrapper).getByText(
            addPokemonFieldsMock[AddPokemonFieldIds.Set].content
        )
    ).toBeInTheDocument();

    const pokemonFlavorTextArea = screen.getByTestId("pokemon-flavortext");
    expect(pokemonFlavorTextArea).toHaveValue(
        addPokemonFieldsMock[AddPokemonFieldIds.FlavorText].content
    );
});

test("submits the form and calls the API client function when all fields are valid", async () => {
    await renderSuspended(AddPokemonDialog);

    const addPokemonForm = screen.getByTestId("add-pokemon-form");
    await fireEvent.submit(addPokemonForm);

    await waitFor(() => {
        expect(addPokemonMock).toHaveBeenCalledTimes(1);
        expect(showToastMock).toHaveBeenCalledWith(
            SeverityLevels.Info,
            "Card Created",
            expect.stringContaining(
                addPokemonFieldsMock[AddPokemonFieldIds.Name].content
            )
        );
        expect(hideAddPokemonDialogMock).toHaveBeenCalledTimes(1);
    });
});
