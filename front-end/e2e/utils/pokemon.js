import { expect } from "@playwright/test";

export async function fillPokemonForm(page, pokemonName, hp, flavorText = "") {
    const nameField = page.getByTestId("pokemon-name");
    await nameField.fill(pokemonName);
    await expect(nameField).toHaveValue(pokemonName);

    const hpField = page.getByTestId("pokemon-hp");
    await hpField.fill(String(hp));
    await expect(hpField).toHaveValue(String(hp));

    const typeDropdown = page.getByTestId("pokemon-type");
    await typeDropdown.click();
    const typeDropdownId = await typeDropdown.getAttribute("id");
    const typeOptions = page.locator(
        `#${typeDropdownId}_list li[data-pc-section=\"option\"]`
    );
    await typeOptions.last().click();
    await expect(typeDropdown).not.toHaveText("");

    const setDropdown = page.getByTestId("pokemon-set");
    await setDropdown.click();
    const setDropdownId = await setDropdown.getAttribute("id");
    const setOptions = page.locator(
        `#${setDropdownId}_list li[data-pc-section=\"option\"]`
    );
    await setOptions.last().click();
    await expect(setDropdown).not.toHaveText("");

    if (flavorText) {
        const flavorTextField = page.getByTestId("pokemon-flavortext");
        await flavorTextField.fill(flavorText);
        await expect(flavorTextField).toHaveValue(flavorText);
    }

    await page.getByTestId("submit-add-pokemon-button").click();
}
