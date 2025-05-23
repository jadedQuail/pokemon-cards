import axios from "axios";

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
        await axios.post(`${apiUrl}/pokemon/add`, dataToSend, {
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
        const response = await axios.get(`${apiUrl}/types`);
        return response.data;
    } catch (error) {
        console.error("Error fetching type options:", error);
        throw error;
    }
}

export async function getSetOptions(apiUrl) {
    try {
        const response = await axios.get(`${apiUrl}/sets`);
        return response.data;
    } catch (error) {
        console.error("Error fetching set options:", error);
        throw error;
    }
}

export async function deletePokemon(apiUrl, pokemonId) {
    try {
        await axios.delete(`${apiUrl}/pokemon/${pokemonId}`);
    } catch (error) {
        console.error("Error deleting Pokemon:", error);
        throw error;
    }
}

export async function deleteType(apiUrl, typeName) {
    try {
        await axios.delete(`${apiUrl}/types/${typeName}`);
    } catch (error) {
        console.error("Error deleting type:", error);
        throw error;
    }
}

export async function deleteSet(apiUrl, setName) {
    try {
        await axios.delete(`${apiUrl}/sets/${setName}`);
    } catch (error) {
        console.error("Error deleting set:", error);
        throw error;
    }
}

export async function addSet(apiUrl, setName) {
    try {
        await axios.post(
            `${apiUrl}/sets`,
            { setName },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return { success: true };
    } catch (error) {
        if (error.response?.status === 409) {
            return {
                success: false,
                message: "You can't add a duplicate category!",
            };
        }

        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function addType(apiUrl, typeName) {
    try {
        await axios.post(
            `${apiUrl}/types`,
            { typeName },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return { success: true };
    } catch (error) {
        if (error.response?.status === 409) {
            return {
                success: false,
                message: "You can't add a duplicate category!",
            };
        }

        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function logUserIn(apiUrl, username, password) {
    try {
        const response = await axios.post(
            `${apiUrl}/auth/login`,
            {
                username,
                password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const token = response.data.token;
        localStorage.setItem("jwt_token", token);

        return {
            success: true,
            user: JSON.parse(atob(token.split(".")[1])),
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Login failed.",
        };
    }
}
