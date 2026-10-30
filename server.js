require("dotenv").config();

const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "jay221chaudhary@",
    database: process.env.DB_NAME || "shopmania",
    waitForConnections: true,
    connectionLimit: 10,
    decimalNumbers: true
});

// Make database connection available to routes
app.locals.db = pool;

// Test server and database
app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            message: "Server and database connected successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Connect routes
// Connect routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
async function startServer() {
    try {
        await pool.query("SELECT 1");

        app.listen(PORT, () => {
            console.log(
                `ShopMania running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );

        console.log(
            "Check your MySQL server and .env settings."
        );

        process.exit(1);
    }
}

startServer();