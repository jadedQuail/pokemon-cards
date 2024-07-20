// Environment variables
require('dotenv').config();

// Initialize
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const db = require('./database/db-connector')

// Only allow certain origins to make requests
// 8080 is my front-end Vue app.
const allowlist = [process.env.FRONTEND]
const corsOptions = {
    origin: function (origin, callback) {
        if (allowlist.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    }

    // // Testing purposes only - allow any origin
    // origin: function (origin, callback) {
    //     callback(null, true);
    // }
};

// Middelware
app.use(cors(corsOptions));
app.use(express.json());

// Queries
const mainGetQuery = `
    SELECT 
        Pokemon.pokemon_id AS 'ID', 
        Pokemon.pokemon_name AS 'Name',
        Pokemon.pokemon_hp AS 'HP',
        Types.type_name AS 'Type',
        Sets.set_name AS 'Set',
        Pokemon.pokemon_flavor_text AS 'Flavor Text'
    FROM Pokemon
    LEFT JOIN Types ON Pokemon.type_id = Types.type_id
    LEFT JOIN Sets ON Pokemon.set_id = Sets.set_id;
`;

const getTypesQuery = `SELECT type_name FROM Types`;

// Main get route, for grabbing all data
app.get('/', async (req, res) => {
    try {
        let results = await db.pool.query(mainGetQuery);
        res.status(200).json(results[0]);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

// Get route for getting column headers
app.get('/column-headers', async (req, res) => {
    try {
        let [, fields] = await db.pool.query(mainGetQuery);
        const headers = fields.map(field => field.name);
        res.status(200).json(headers);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

// Get route for getting types options for forms
app.get('/get-type-options', async (req, res) => {
    try {
        const results = await db.pool.query(getTypesQuery);
        const types = results[0].map(typeObject => typeObject.type_name);
        res.status(200).json(types);
    } 
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

// Post route for submitting a new pokemon
app.post('/add-pokemon', async (req, res) => {
    let data = req.body;
    try {
        console.log(data);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

app.listen(PORT, () => {
    console.log(`Example app is listening on port ${PORT}.`);
});