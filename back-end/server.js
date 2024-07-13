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

app.use(cors(corsOptions));

// Main get route, for grabbing all data
app.get('/', async (req, res) => {
    let query = "SELECT * FROM Pokemon;";
    try {
        let results = await db.pool.query(query);
        res.status(200).json(results[0]);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

// Get route for getting column headers
app.get('/column-headers', async (req, res) => {
    let query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'Pokemon';";
    try {
        let results = await db.pool.query(query);
        results = results[0].map((object) => object.COLUMN_NAME);
        res.status(200).json(results);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

// // Test route
// app.post('/test', async (req, res) => {
    
//     let query = "INSERT INTO Pokemon (pokemon_id, pokemon_name) VALUES (6, 'Garfielf');";
//     try {
//         await db.pool.query(query);
//     }
//     catch (err) {
//         console.error(err);
//         res.sendStatus(400);
//     }

//     // Success
//     res.redirect('/');

// });

app.listen(PORT, () => {
    console.log(`Example app is listening on port ${PORT}.`);
});