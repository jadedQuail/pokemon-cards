const db = require("../database/db-connector");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validatePassword } = require("../utils/passwordValidator");

// TODO: Figure out a way to protect this so a malicious user does not create a billion users as a DDoS. Maybe a CAPTCHA?

exports.createUser = async (req, res) => {
    const { username, password, confirmPassword, isAdmin = false } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.sendStatus(400);
    }

    const validation = validatePassword(password, confirmPassword);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO Users (username, password_hash, is_admin) VALUES (?, ?, ?)`;

        await db.pool.query(query, [username, hashedPassword, isAdmin]);
        return res.sendStatus(201);
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.sendStatus(409);
        }

        console.error("Error creating user:", err);
        return res.sendStatus(500);
    }
};

exports.login = async (req, res) => {
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
