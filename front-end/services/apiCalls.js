import axios from "axios";

export async function fetchPokemonData(apiUrl) {
    try {
        const response = await axios.get(apiUrl);
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
        await axios.post(`${apiUrl}/edit-pokemon/${id}`, dataToSend, {
            headers: {
                "Content-Type": "application/json",
            },
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
        await axios.post(`${apiUrl}/add-pokemon`, dataToSend, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export async function getTypeOptions(apiUrl) {
    try {
        const response = await axios.get(`${apiUrl}/get-type-options`);
        return response.data;
    } catch (error) {
        console.error("Error fetching type options:", error);
        throw error;
    }
}

export async function getSetOptions(apiUrl) {
    try {
        const response = await axios.get(`${apiUrl}/get-set-options`);
        return response.data;
    } catch (error) {
        console.error("Error fetching set options:", error);
        throw error;
    }
}

export async function deletePokemon(apiUrl, pokemonId) {
    try {
        await axios.delete(`${apiUrl}/delete-pokemon/${pokemonId}`);
    } catch (error) {
        console.error("Error deleting Pokemon:", error);
        throw error;
    }
}

export async function deleteType(apiUrl, typeName) {
    try {
        await axios.delete(`${apiUrl}/delete-type/${typeName}`);
    } catch (error) {
        console.error("Error deleting type:", error);
        throw error;
    }
}

export async function deleteSet(apiUrl, setName) {
    try {
        await axios.delete(`${apiUrl}/delete-set/${setName}`);
    } catch (error) {
        console.error("Error deleting set:", error);
        throw error;
    }
}
