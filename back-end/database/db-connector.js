import mysql from "mysql2";

// Connection to a local database server
const pool = mysql
    .createPool({
    connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        multipleStatements: false,
    })
    .promise();

// Export this connection
export default { pool };
