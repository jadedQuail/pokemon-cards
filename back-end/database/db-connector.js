import "dotenv/config";
import mysql from "mysql2";

const env = (process.env.ENVIRONMENT || "").toLowerCase();
const isNotProduction = env !== "production";

const pool = mysql
    .createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        multipleStatements: false,
        ssl: isNotProduction
            ? undefined
            : {
                  rejectUnauthorized: true,
                  minVersion: "TLSv1.2",
              },
    })
    .promise();

export default { pool };
