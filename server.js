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
    host: '',
    user: 'sandbox_user',
    password: '',
    database: 'sandbox'
});

app.get('/api/tasks', (req, res) => {
    const sql = `SELECT task.tid, project.pid, project.title AS project_title, project.start AS start_date, task.deadline, task.title AS task_title, task.stage
                 FROM task
                 LEFT JOIN project ON task.pid = project.pid;`;

    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }

        const tasks = results.map((task) => {
            return {
                id: task.tid,
                project: {
                    id: task.pid,
                    name: task.project_title,
                },
                start: task.start_date,
                end: task.deadline,
                nameAndTitle: task.task_title,
                type: `task`,
            };
        });

        console.log(JSON.stringify(tasks));
        res.status(200).json(tasks);
    });
});

// // PUT endpoint to update a specific task
// app.put('/api/tasks/:id', (req, res) => {
//     const taskId = req.params.id;
//     const { nameAndTitle, start, end, progress } = req.body;

//     // Example SQL update query
//     const sql = `
//         UPDATE task
//         SET title = ?,
//             start = ?,
//             deadline = ?,
//             progress = ?
//         WHERE tid = ?;
//     `;

//     db.query(sql, [nameAndTitle, start, end, progress, taskId], (error, result) => {
//         if (error) {
//             console.error('Error updating task:', error);
//             return res.status(500).send('Error updating task');
//         }

//         console.log(`Task ${taskId} updated successfully`);
//         res.status(200).send(`Task ${taskId} updated successfully`);
//     });
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



