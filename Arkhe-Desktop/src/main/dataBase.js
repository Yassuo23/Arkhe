const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2");

const envPaths = [
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../../.gitignore/.env")
];
const envPath = envPaths.find((candidate) => fs.existsSync(candidate));

if (envPath) {
    dotenv.config({ path: envPath, quiet: true });
}

const missingVariables = ["DB_HOST", "DB_USER", "DB_NAME"]
    .filter((name) => !process.env[name]?.trim());

if (missingVariables.length > 0) {
    throw new Error(
        `Configuração do banco incompleta. Defina as variáveis: ${missingVariables.join(", ")}.`
    );
}

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT deve ser um número inteiro entre 1 e 65535.");
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST.trim(),
    port,
    user: process.env.DB_USER.trim(),
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME.trim()
});

module.exports = connection;
