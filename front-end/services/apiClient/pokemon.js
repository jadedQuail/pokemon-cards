import axios from "axios";
import { getAuthHeaders } from "./utils";

export async function fetchPokemonData(apiUrl) {
    try {
        const response = await axios.get(`${apiUrl}/pokemon`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function editPokemon(apiUrl, fields, id) {
    try {
        const dataToSend = {
            pokemonName: fields.name.content,
            pokemonHP: fields.hp.content,
            pokemonFlavorText: fields.flavorText.content,
            pokemonType: fields.type.content,
            pokemonSet: fields.set.content,
        };
        await axios.post(`${apiUrl}/pokemon/edit/${id}`, dataToSend, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export async function addPokemon(apiUrl, fields) {
    try {
        const dataToSend = {
            pokemonName: fields.name.content,
            pokemonHP: fields.hp.content,
            pokemonFlavorText: fields.flavorText.content,
            pokemonType: fields.type.content,
            pokemonSet: fields.set.content,
        };
        await axios.post(`${apiUrl}/pokemon/add`, dataToSend, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export async function deletePokemon(apiUrl, pokemonId) {
    try {
        await axios.delete(`${apiUrl}/pokemon/${pokemonId}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error deleting Pokemon:", error);
        throw error;
    }
}
