const db = require("../database/db-connector");

exports.getTypes = async (req, res) => {
    try {
        const [rows] = await db.pool.query(`SELECT type_name FROM Types;`);
        const types = rows.map((typeObject) => typeObject.type_name);
        res.status(200).json(types);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

exports.addType = async (req, res) => {
    const { typeName } = req.body;
    const query = `INSERT INTO Types (type_name) VALUES (?);`;

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

exports.deleteType = async (req, res) => {
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
