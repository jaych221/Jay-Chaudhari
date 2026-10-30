require("dotenv").config();

const db = require("./database");

async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log("Database connected successfully!");

        const [rows] = await connection.query(
            "SELECT DATABASE() AS databaseName"
        );

        console.log("Database name:", rows[0].databaseName);

        connection.release();
        await db.end();

    } catch (error) {
        console.error("Database connection failed:", error.message);
        await db.end();
        process.exitCode = 1;
    }
}

testConnection();