import db from "../database/db-connector.js";
import { CategoryErrorCodes } from "../../shared/errorCodes.js";

export const getSets = async (req, res) => {
    try {
        const [rows] = await db.pool.query(`SELECT set_name FROM Sets;`);
        const sets = rows.map((setObject) => setObject.set_name);
        res.status(200).json(sets);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const addSet = async (req, res) => {
    const { setName } = req.body;
    const query = `INSERT INTO Sets (set_name) VALUES (?);`;

    const isValid = /^[a-zA-Z0-9\- ]+$/.test(setName);
    if (!isValid) {
        return res.status(400).json({
            errorCode: CategoryErrorCodes.INVALID_CHARACTERS,
        });
    }

    try {
        await db.pool.query(query, [setName]);
        return res.sendStatus(201);
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.sendStatus(409);
        }
        console.error("Error adding set:", err);
        return res.sendStatus(500);
    }
};

export const deleteSet = async (req, res) => {
    const setName = req.params.set;
    const query = `DELETE FROM Sets WHERE set_name = ?`;

    try {
        await db.pool.query(query, [setName]);
        return res.sendStatus(200);
    } catch (err) {
        console.error("Error deleting set:", err);
        return res.sendStatus(500);
    }
};
