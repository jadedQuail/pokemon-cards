import { RegistrationErrorCodes } from "../../shared/errorCodes.js";

export function validateUsernameChoice(username) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;

    if (!username || !usernameRegex.test(username)) {
        return {
            valid: false,
            code: RegistrationErrorCodes.USERNAME_INVALID,
        };
    }

    return { valid: true };
}

export function validatePasswordChoice(password, confirmPassword) {
    if (password !== confirmPassword) {
        return {
            valid: false,
            code: RegistrationErrorCodes.PASSWORD_MISMATCH,
        };
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,20}$/;

    if (!passwordRegex.test(password)) {
        return {
            valid: false,
            code: RegistrationErrorCodes.PASSWORD_WEAK,
        };
    }

    return { valid: true };
}
