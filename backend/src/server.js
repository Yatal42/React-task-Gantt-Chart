
// src/server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser

// Add debugging logs to verify environment variables
console.log('Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Uncomment only for debugging, avoid in production
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

// Error-handling middleware
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});