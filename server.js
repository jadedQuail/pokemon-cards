const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Successful response.');
});

app.listen(3500, () => {
    console.log('Example app is listening on port 3500.');
});