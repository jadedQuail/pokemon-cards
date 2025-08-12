import axios from "axios";
import { getAuthHeaders } from "./utils";

// TODO - Consolidate my .env's into one .env for both

export async function fetchPokemonData() {
    try {
        const response = await axios.get("/pokemon");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function editPokemon(fields, id) {
    try {
        const dataToSend = {
            pokemonName: fields.name.content,
            pokemonHP: fields.hp.content,
            pokemonFlavorText: fields.flavorText.content,
            pokemonType: fields.type.content,
            pokemonSet: fields.set.content,
        };
        await axios.post(`/pokemon/edit/${id}`, dataToSend, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export async function addPokemon(fields) {
    try {
        const dataToSend = {
            pokemonName: fields.name.content,
            pokemonHP: fields.hp.content,
            pokemonFlavorText: fields.flavorText.content,
            pokemonType: fields.type.content,
            pokemonSet: fields.set.content,
        };
        await axios.post("/pokemon/add", dataToSend, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export async function deletePokemon(pokemonId) {
    try {
        await axios.delete(`/pokemon/${pokemonId}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error deleting Pokemon:", error);
        throw error;
    }
}
