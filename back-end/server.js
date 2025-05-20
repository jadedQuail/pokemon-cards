require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const db = require("./database/db-connector");

const typeRoutes = require("./routes/typeRoutes");
const setRoutes = require("./routes/setRoutes");
const authRoutes = require("./routes/authRoutes");

// TODO: Move pokemon-related functions into own route/controller file

// TODO: Clean up npm vulnerabilities

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
    // },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/types", typeRoutes);
app.use("/sets", setRoutes);
app.use("/auth", authRoutes);

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

app.get("/", async (req, res) => {
    try {
        let results = await db.pool.query(mainGetQuery);
        return res.status(200).json(results[0]);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

app.get("/column-headers", async (req, res) => {
    try {
        let [, fields] = await db.pool.query(mainGetQuery);
        const headers = fields.map((field) => field.name);
        return res.status(200).json(headers);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
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
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
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
        return res.sendStatus(201);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

app.delete("/delete-pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;

    const deleteQuery = `DELETE FROM Pokemon WHERE pokemon_id = ?`;

    try {
        await db.pool.query(deleteQuery, [pokemonId]);
        return res.sendStatus(200);
    } catch (err) {
        console.error("Error deleting Pokemon:", err);
        return res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Example app is listening on port ${PORT}.`);
});
