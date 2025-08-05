import axios from "axios";
import { getAuthHeaders } from "./utils";
import { CategoryErrorCodes } from "../../../shared/errorCodes";

export async function getTypeOptions() {
    try {
        const response = await axios.get("/types");
        return response.data;
    } catch (error) {
        console.error("Error fetching type options:", error);
        throw error;
    }
}

export async function deleteType(typeName) {
    try {
        await axios.delete(`/types/${typeName}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error deleting type:", error);
        throw error;
    }
}

export async function addType(typeName) {
    try {
        await axios.post("/types", { typeName }, { headers: getAuthHeaders() });
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
