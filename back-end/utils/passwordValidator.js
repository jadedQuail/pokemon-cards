const errorCodes = require("../../shared/errorCodes");
const RegistrationErrorCodes = errorCodes.RegistrationErrorCodes;

function validatePassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return {
            valid: false,
            code: RegistrationErrorCodes.PASSWORD_MISMATCH,
        };
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,20}$/;

    console.log(typeof passwordRegex);

    if (!passwordRegex.test(password)) {
        return {
            valid: false,
            code: RegistrationErrorCodes.PASSWORD_WEAK,
        };
    }

    return { valid: true };
}

module.exports = { validatePassword };
