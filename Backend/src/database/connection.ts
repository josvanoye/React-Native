import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("¿Hay contraseña?:", !!process.env.DB_PASSWORD);

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default connection;
