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
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    // res.send('Successful response.');
    res.sendFile(__dirname + '/views/index.html');
});

// Test route
app.post('/test', async (req, res) => {
    
    let query = "INSERT INTO Pokemon (pokemon_id, pokemon_name) VALUES (6, 'Garfielf');";
    try {
        await db.pool.query(query);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }

    // Success
    res.redirect('/');

});

app.listen(PORT, () => {
    console.log(`Example app is listening on port ${PORT}.`);
});