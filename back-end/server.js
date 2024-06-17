// Initialize
const express = require('express');
const app = express();
const PORT = 11112;

// Database connection
const db = require('./database/db-connector')

app.get('/', (req, res) => {
    // res.send('Successful response.');
    res.sendFile(__dirname + '/views/index.html');
});

// Test route
app.post('/test', async (req, res) => {
    
    let query = "INSERT INTO Pokemon (pokemon_id, pokemon_name) VALUES (4, 'Frederick');";
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