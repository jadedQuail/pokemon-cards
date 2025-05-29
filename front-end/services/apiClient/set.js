import axios from "axios";
import { getAuthHeaders } from "./utils";

export async function getSetOptions(apiUrl) {
    try {
        const response = await axios.get(`${apiUrl}/sets`);
        return response.data;
    } catch (error) {
        console.error("Error fetching set options:", error);
        throw error;
    }
}

export async function addSet(apiUrl, setName) {
    try {
        await axios.post(
            `${apiUrl}/sets`,
            { setName },
            { headers: getAuthHeaders() }
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

export async function deleteSet(apiUrl, setName) {
    try {
        await axios.delete(`${apiUrl}/sets/${setName}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error deleting set:", error);
        throw error;
    }
}
