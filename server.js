const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const db = mysql.createPool({
    host: '185.60.170.80',
    user: 'sandbox_user',
    password: '123123',
    database: 'sandbox'
});

app.get('/api/tasks', (req, res) => {
    const sql = `
        SELECT task.tid, project.pid, project.title AS project_title, project.start AS start_date, task.deadline, task.title AS task_title, task.stage, task.dependencies, task.progress
        FROM task
        LEFT JOIN project ON task.pid = project.pid;
    `;

    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }

        const tasks = results.map((task) => ({
            id: task.tid,
            project: {
                id: task.pid,
                name: task.project_title,
            },
            start: task.start_date,
            end: task.deadline,
            nameAndTitle: task.task_title,
            type: 'task',
            dependencies: JSON.parse(task.dependencies || '[]'), // Handle NULL by parsing as an empty array
            progress: task.progress
        }));

        console.log(JSON.stringify(tasks));
        res.status(200).json(tasks);
    });
});

// POST endpoint to add a new task
app.post('/api/tasks', (req, res) => {
    const { id, nameAndTitle, start, end, pid, descriptionText, dependencies } = req.body;

    // Ensure dates are in the correct format
    const formattedStart = new Date(start).toISOString().split('T')[0];
    const formattedEnd = new Date(end).toISOString().split('T')[0];

    // Convert dependencies array to JSON string
    const dependenciesJson = JSON.stringify(dependencies || []);

    // SQL query to insert the new task
    const insertTaskSql = `
        INSERT INTO task (tid, title, startdate, deadline, pid, descriptionText, dependencies)
        VALUES (?, ?, DATE(?), DATE(?), ?, ?, ?);
    `;

    db.query(insertTaskSql, [id, nameAndTitle, formattedStart, formattedEnd, pid, descriptionText, dependenciesJson], (error, result) => {
        if (error) {
            console.error('Error adding task:', error);
            return res.status(500).send({ message: 'Error adding task' });
        }

        console.log(`Task ${id} added successfully.`);
        res.status(201).send({ message: 'Task added successfully', id });
    });
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { nameAndTitle, start, end, dependencies, progress } = req.body;

    // Ensure dates are in the correct format
    const formattedStart = new Date(start).toISOString().split('T')[0];
    const formattedEnd = new Date(end).toISOString().split('T')[0];

    console.log('Received data:', { taskId, nameAndTitle, start, end, dependencies, progress });

    // Convert dependencies array to JSON string
    const dependenciesJson = JSON.stringify(dependencies || []);

    // SQL query to update the task
    const taskSql = `
        UPDATE task
        SET title = ?,
            startdate = DATE(?),
            deadline = DATE(?),
            dependencies = ?,
            progress= ?
        WHERE tid = ?;
    `;

    db.query(taskSql, [nameAndTitle, formattedStart, formattedEnd, dependenciesJson, progress, taskId], (error, result) => {
        if (error) {
            console.error('Error updating task:', error);
            return res.status(500).send({ data: { taskId: taskId, message: 'Error updating task' } });
        }

        if (result.affectedRows === 0) {
            console.error(`Task with ID ${taskId} not found.`);
            return res.status(404).send({ data: { taskId: taskId, message: 'Task not found' } });
        }

        console.log(`Task ${taskId} updated successfully.`);
        res.status(200).send({ data: { taskId: taskId, message: 'Task updated successfully' } });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    const deleteTaskSql = `
        DELETE FROM task
        WHERE tid = ?;
    `;

    db.query(deleteTaskSql, [taskId], (error, result) => {
        if (error) {
            console.error('Error deleting task:', error);
            return res.status(500).send({ data: { taskId: taskId, message: 'Error deleting task'} });
        }

        console.log(`Task ${taskId} deleted successfully`);
        res.status(200).send({ data: { taskId: taskId, message: 'Task deleted successfully' } });
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



