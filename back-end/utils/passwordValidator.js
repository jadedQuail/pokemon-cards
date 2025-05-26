function validatePassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return {
            valid: false,
            message: "Passwords do not match.",
        };
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,20}$/;

    console.log(typeof passwordRegex);

    if (!passwordRegex.test(password)) {
        return {
            valid: false,
            message:
                "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        };
    }

    return { valid: true };
}

module.exports = { validatePassword };
