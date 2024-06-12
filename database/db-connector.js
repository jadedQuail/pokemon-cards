var mysql = require('mysql2');

// Connection to a local database server
var pool = mysql.createPool({
    connectionLimit     : 10,
    host                : '127.0.0.1',
    user                : 'root',
    password            : 'buffalo',
    database            : 'pokemon_cards',
    multipleStatements  : true
}).promise();

// Export this connection
module.exports.pool = pool;