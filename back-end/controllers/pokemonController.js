import db from "../database/db-connector.js";

export const getPokemon = async (req, res) => {
    const query = `
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

    try {
        let results = await db.pool.query(query);
        return res.status(200).json(results[0]);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const editPokemon = async (req, res) => {
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
};

export const addPokemon = async (req, res) => {
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
};

export const deletePokemon = async (req, res) => {
    const pokemonId = req.params.id;

    const deleteQuery = `DELETE FROM Pokemon WHERE pokemon_id = ?`;

    try {
        await db.pool.query(deleteQuery, [pokemonId]);
        return res.sendStatus(200);
    } catch (err) {
        console.error("Error deleting Pokemon:", err);
        return res.sendStatus(500);
    }
};
