import axios from "axios";
import { getAuthHeaders } from "./utils";
import { CategoryErrorCodes } from "../../../shared/errorCodes";

export async function getSetOptions() {
    try {
        const response = await axios.get("/sets");
        return response.data;
    } catch (error) {
        console.error("Error fetching set options:", error);
        throw error;
    }
}

export async function addSet(setName) {
    try {
        await axios.post("/sets", { setName }, { headers: getAuthHeaders() });
        return { success: true };
    } catch (error) {
        if (error.response?.status === 409) {
            return {
                success: false,
                message: "You can't add a duplicate category!",
            };
        } else if (
            error.response?.data?.errorCode ===
            CategoryErrorCodes.INVALID_CHARACTERS
        ) {
            return {
                success: false,
                message:
                    "Invalid characters detected; you can only use alphanumeric characters, spaces, and dashes.",
            };
        }

        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function deleteSet(setName) {
    try {
        await axios.delete(`/sets/${setName}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error deleting set:", error);
        throw error;
    }
}
