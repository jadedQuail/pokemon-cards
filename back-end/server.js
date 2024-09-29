require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const db = require("./database/db-connector");

const allowlist = [process.env.FRONTEND];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowlist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },

    // // Testing purposes only - allow any origin
    // origin: function (origin, callback) {
    //     callback(null, true);
    // }
};

app.use(cors(corsOptions));
app.use(express.json());

const mainGetQuery = `
    SELECT 
        Pokemon.pokemon_id AS 'id', 
        Pokemon.pokemon_name AS 'name',
        Pokemon.pokemon_hp AS 'hp',
        Types.type_name AS 'type',
        Sets.set_name AS 'set',
        Pokemon.pokemon_flavor_text AS 'flavorText'
    FROM Pokemon
    LEFT JOIN Types ON Pokemon.type_id = Types.type_id
    LEFT JOIN Sets ON Pokemon.set_id = Sets.set_id;
`;

const getTypesQuery = `SELECT type_name FROM Types;`;

const getSetsQuery = `SELECT set_name FROM Sets;`;

app.get("/", async (req, res) => {
    try {
        let results = await db.pool.query(mainGetQuery);
        res.status(200).json(results[0]);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.get("/column-headers", async (req, res) => {
    try {
        let [, fields] = await db.pool.query(mainGetQuery);
        const headers = fields.map((field) => field.name);
        res.status(200).json(headers);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.get("/get-type-options", async (req, res) => {
    try {
        const results = await db.pool.query(getTypesQuery);
        const types = results[0].map((typeObject) => typeObject.type_name);
        res.status(200).json(types);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.get("/get-set-options", async (req, res) => {
    try {
        const results = await db.pool.query(getSetsQuery);
        const sets = results[0].map((setObject) => setObject.set_name);
        res.status(200).json(sets);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.post("/edit-pokemon/:id", async (req, res) => {
    let data = req.body;
    let pokemonId = req.params.id;

    let query = `
        UPDATE Pokemon 
        SET 
            pokemon_name = ?, 
            pokemon_hp = ?, 
            pokemon_flavor_text = ?, 
            type_id = (SELECT type_id FROM Types WHERE type_name = ?), 
            set_id = (SELECT set_id FROM Sets WHERE set_name = ?)
        WHERE 
            pokemon_id = ?;
    `;

    let values = [
        data.pokemonName,
        data.pokemonHP,
        data.pokemonFlavorText,
        data.pokemonType,
        data.pokemonSet,
        pokemonId,
    ];

    try {
        await db.pool.query(query, values);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.post("/add-pokemon", async (req, res) => {
    let data = req.body;

    let query = `
        INSERT INTO Pokemon (pokemon_name, pokemon_hp, pokemon_flavor_text, type_id, set_id)
        VALUES (
            ?, ?, ?, 
            (SELECT type_id FROM Types WHERE type_name = ?),
            (SELECT set_id FROM Sets WHERE set_name = ?)
        );
    `;

    let values = [
        data.pokemonName,
        data.pokemonHP,
        data.pokemonFlavorText,
        data.pokemonType,
        data.pokemonSet,
    ];

    try {
        await db.pool.query(query, values);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.delete("/delete-pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;

    const deleteQuery = `DELETE FROM Pokemon WHERE pokemon_id = ?`;

    try {
        await db.pool.query(deleteQuery, [pokemonId]);
        res.sendStatus(200);
    } catch (err) {
        console.error("Error deleting Pokemon:", err);
        res.sendStatus(400);
    }
});

app.listen(PORT, () => {
    console.log(`Example app is listening on port ${PORT}.`);
});
