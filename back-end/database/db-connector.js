var mysql = require('mysql2');

// Connection to a local database server
var pool = mysql.createPool({
    connectionLimit     : 10,
    host                : process.env.DB_HOST,
    user                : process.env.DB_USER,
    password            : process.env.DB_PASSWORD,
    database            : process.env.DATABASE,
    multipleStatements  : true
}).promise();

// Export this connection
module.exports.pool = pool;