// // src/server.js

// // Load environment variables from .env file
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2'); // השתמש ב-mysql2

// const app = express();
// const port = process.env.PORT || 8080;

// app.use(cors());
// app.use(express.json()); // השתמש ב-express.json() במקום body-parser

// // Add debugging logs to verify environment variables
// console.log('Environment Variables:');
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// // console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Uncomment only for debugging, avoid in production
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('PORT:', process.env.PORT);

// // Create a MySQL connection pool to manage database connections
// const db = mysql.createPool({
//     connectionLimit: 10, // Adjust as needed
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// // Test database connection
// db.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         process.exit(1); // Exit process with failure
//     }
//     console.log('Connected to the MySQL database.');
//     connection.release();
// });

// // GET endpoint to retrieve tasks from the database
// app.get('/api/tasks', (req, res) => {
//     const sql = `
//         SELECT task.tid, project.pid, project.title AS project_title, project.start AS start_date, task.deadline, task.title AS task_title, task.dependencies, task.progress
//         FROM task
//         LEFT JOIN project ON task.pid = project.pid;
//     `;

//     db.query(sql, (error, results) => {
//         if (error) {
//             return res.status(500).send(error);
//         }

//         // Transform the database result into the required format
//         const tasks = results.map((task) => {
//             console.log(`Task ID: ${task.tid}, Dependencies: "${task.dependencies}", Progress: ${task.progress}, Type: ${typeof task.dependencies}`);

//             let parsedDependencies = [];
//             if (task.dependencies && typeof task.dependencies === 'string') {
//                 try {
//                     parsedDependencies = JSON.parse(task.dependencies);
//                 } catch (e) {
//                     console.error(`Error parsing dependencies for task ${task.tid}:`, e);
//                     parsedDependencies = [];
//                 }
//             } else if (Array.isArray(task.dependencies)) {
//                 parsedDependencies = task.dependencies;
//             } else {
//                 console.warn(`Unexpected type for dependencies in task ${task.tid}:`, typeof task.dependencies);
//                 parsedDependencies = [];
//             }

//             return {
//                 id: task.tid,
//                 project: {
//                     id: task.pid,
//                     name: task.project_title,
//                 },
//                 start: task.start_date,
//                 end: task.deadline,
//                 nameAndTitle: task.task_title,
//                 type: 'task',
//                 dependencies: parsedDependencies,
//                 progress: task.progress
//             };
//         });

//         console.log(JSON.stringify(tasks));
//         res.status(200).json(tasks);
//     });
// });

// // POST endpoint to add a new task to the database
// app.post('/api/tasks', (req, res) => {
//     const { id, nameAndTitle, start, end, pid, descriptionText, dependencies } = req.body;

//     // Ensure dates are in the correct format
//     const formattedStart = new Date(start).toISOString().split('T')[0];
//     const formattedEnd = new Date(end).toISOString().split('T')[0];

//     // Convert dependencies array to JSON string
//     const dependenciesJson = JSON.stringify(dependencies || []);

//     // SQL query to insert the new task, including progress
//     const insertTaskSql = `
//         INSERT INTO task (tid, title, startdate, deadline, pid, descriptionText, dependencies)
//         VALUES (?, ?, DATE(?), DATE(?), ?, ?, ?);
//     `;

//     db.query(insertTaskSql, [id, nameAndTitle, formattedStart, formattedEnd, pid, descriptionText, dependenciesJson], (error, result) => {
//         if (error) {
//             console.error('Error adding task:', error);
//             return res.status(500).send({ message: 'Error adding task' });
//         }

//         console.log(`Task ${id} added successfully.`);
//         res.status(201).send({ message: 'Task added successfully', id });
//     });
// });

// // PUT endpoint to update an existing task in the database
// app.put('/api/tasks/:id', (req, res) => {
//     const taskId = req.params.id;
//     const { nameAndTitle, start, end, dependencies, progress } = req.body;

//     // Ensure dates are in the correct format
//     const formattedStart = new Date(start).toISOString().split('T')[0];
//     const formattedEnd = new Date(end).toISOString().split('T')[0];

//     console.log('Received data:', { taskId, nameAndTitle, start, end, dependencies, progress });

//     // Convert dependencies array to JSON string
//     const dependenciesJson = JSON.stringify(dependencies || []);

//     // SQL query to update the task
//     const taskSql = `
//         UPDATE task
//         SET title = ?,
//             startdate = DATE(?),
//             deadline = DATE(?),
//             dependencies = ?,
//             progress = ?
//         WHERE tid = ?;
//     `;

//     db.query(taskSql, [nameAndTitle, formattedStart, formattedEnd, dependenciesJson, progress, taskId], (error, result) => {
//         if (error) {
//             console.error('Error updating task:', error);
//             return res.status(500).send({ data: { taskId: taskId, message: 'Error updating task' } });
//         }

//         if (result.affectedRows === 0) {
//             console.error(`Task with ID ${taskId} not found.`);
//             return res.status(404).send({ data: { taskId: taskId, message: 'Task not found' } });
//         }

//         console.log(`Task ${taskId} updated successfully.`);
//         res.status(200).send({ data: { taskId: taskId, message: 'Task updated successfully' } });
//     });
// });

// // DELETE endpoint to remove a task from the database
// app.delete('/api/tasks/:id', (req, res) => {
//     const taskId = req.params.id;

//     const deleteTaskSql = `
//         DELETE FROM task
//         WHERE tid = ?;
//     `;

//     db.query(deleteTaskSql, [taskId], (error, result) => {
//         if (error) {
//             console.error('Error deleting task:', error);
//             return res.status(500).send({ data: { taskId: taskId, message: 'Error deleting task'} });
//         }

//         console.log(`Task ${taskId} deleted successfully`);
//         res.status(200).send({ data: { taskId: taskId, message: 'Task deleted successfully' } });
//     });
// });

// // Handle undefined routes
// app.use((req, res) => {
//     res.status(404).send({ message: 'Route not found' });
// });

// // Error-handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// // Start the server and listen on the specified port
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

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