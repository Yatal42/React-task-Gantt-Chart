const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool to manage database connections
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust as needed
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit process with failure
    }
    console.log('Connected to the MySQL database.');
    connection.release();
});

module.exports = pool.promise(); // Use promise-based queries