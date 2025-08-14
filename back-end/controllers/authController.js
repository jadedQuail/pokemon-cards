import db from "../database/db-connector.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    RegistrationErrorCodes,
    TurnstileErrorCodes,
} from "../../shared/errorCodes.js";
import {
    validateUsernameChoice,
    validatePasswordChoice,
} from "../utils/credentialValidator.js";

// TODO - Need to implement an error message to the user if Turnstile hangs; right now, this is only a problem on my terrible internet

export const validateTurnstile = async (req, res) => {
    const token = req.body?.token || req.body?.["cf-turnstile-response"];

    if (!token) {
        return res.status(400).json({
            errorCode: TurnstileErrorCodes.TOKEN_NOT_FOUND,
        });
    }

    try {
        const params = new URLSearchParams();
        params.append("secret", process.env.NUXT_TURNSTILE_SECRET_KEY);
        params.append("response", token);
        if (req.ip) params.append("remoteip", req.ip);

        const resp = await fetch(process.env.TURNSTILE_API_URL, {
            method: "POST",
            body: params,
        });

        const data = await resp.json();

        const allowlist = (process.env.ALLOWED_TURNSTILE_HOSTS || "")
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean);

        if (
            !data.success ||
            (allowlist.length > 0 &&
                data.hostname &&
                !allowlist.includes(data.hostname))
        ) {
            return res.status(403).json({
                errorCode: TurnstileErrorCodes.VALIDATION_FAILED,
            });
        }

        return res.sendStatus(204);
    } catch (err) {
        console.error("Error validating Turnstile token:", err);
        return res
            .status(502)
            .json({ errorCode: TurnstileErrorCodes.MISC_ERROR });
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.sendStatus(400);
    }

    try {
        const query = `DELETE FROM Users WHERE user_id = ?`;
        const [result] = await db.pool.query(query, [userId]);

        if (result.affectedRows === 0) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);
    } catch (err) {
        console.error("Error deleting user:", err);
        return res.sendStatus(500);
    }
};

export const createUser = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.status(400).json({
            errorCode: RegistrationErrorCodes.MISSING_FIELDS,
        });
    }

    const usernameValidation = validateUsernameChoice(username);
    if (!usernameValidation.valid) {
        return res.status(400).json({
            errorCode: usernameValidation.code,
        });
    }

    const passwordValidation = validatePasswordChoice(
        password,
        confirmPassword
    );
    if (!passwordValidation.valid) {
        return res.status(400).json({
            errorCode: passwordValidation.code,
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const isAdmin = false;

        const query = `INSERT INTO Users (username, password_hash, is_admin) VALUES (?, ?, ?)`;

        await db.pool.query(query, [username, hashedPassword, isAdmin]);
        return res.sendStatus(201);
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                errorCode: RegistrationErrorCodes.DUPLICATE_USER,
            });
        }

        console.error("Error creating user:", err);
        return res.status(500).json({
            errorCode: RegistrationErrorCodes.UNKNOWN_ERROR,
        });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.sendStatus(400);
    }

    try {
        const query = `SELECT * FROM Users WHERE username = ? LIMIT 1`;
        const [results] = await db.pool.query(query, [username]);

        if (results.length === 0) {
            return res.sendStatus(401);
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.sendStatus(401);
        }

        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username,
                isAdmin: user.is_admin,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
        });
    } catch (err) {
        console.error("Error logging in:", err);
        return res.sendStatus(500);
    }
};
