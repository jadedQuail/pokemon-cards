import "dotenv/config";
import fs from "fs";
import mysql from "mysql2";

// const pool = mysql
//     .createPool({
//         connectionLimit: 10,
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DATABASE,
//         multipleStatements: false,
//         ssl: {
//             ca: fs.readFileSync(
//                 new URL("../certs/BaltimoreCyberTrustRoot.pem", import.meta.url)
//             ),
//         },
//     })
//     .promise();

const pool = mysql
    .createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        multipleStatements: false,
        ssl: {
            rejectUnauthorized: false,
        },
    })
    .promise();

export default { pool };
