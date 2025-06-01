import db from "../database/db-connector.js";
import { CategoryErrorCodes } from "../../shared/errorCodes.js";

export const getTypes = async (req, res) => {
    try {
        const [rows] = await db.pool.query(`SELECT type_name FROM Types;`);
        const types = rows.map((typeObject) => typeObject.type_name);
        res.status(200).json(types);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const addType = async (req, res) => {
    const { typeName } = req.body;
    const query = `INSERT INTO Types (type_name) VALUES (?);`;

    const isValid = /^[a-zA-Z0-9\- ]+$/.test(typeName);
    if (!isValid) {
        return res.status(400).json({
            errorCode: CategoryErrorCodes.INVALID_CHARACTERS,
        });
    }

    try {
        await db.pool.query(query, [typeName]);
        return res.sendStatus(201);
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.sendStatus(409);
        }
        console.error("Error adding type:", err);
        return res.sendStatus(500);
    }
};

export const deleteType = async (req, res) => {
    const typeName = req.params.type;
    const query = `DELETE FROM Types WHERE type_name = ?`;

    try {
        await db.pool.query(query, [typeName]);
        return res.sendStatus(200);
    } catch (err) {
        console.error("Error deleting type:", err);
        return res.sendStatus(500);
    }
};
