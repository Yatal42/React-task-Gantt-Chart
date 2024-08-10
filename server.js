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
app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { nameAndTitle, start, end, dependencies } = req.body;

    const taskSql = `
        UPDATE task
        SET title = ?,
            startdate = ?,
            deadline = ?
        WHERE tid = ?;
    `;

    // Update task in the DB
    db.query(taskSql, [nameAndTitle, start, end, taskId], (error, result) => {
        if (error) {
            console.error('Error updating task:', error);
            return res.status(500).send({ data: { taskId: taskId, message: 'Error updating task'} });
        }

        console.log(`Task ${taskId} updated successfully`);
    });

    // Get project of the task from DB
    const getProjectSql = `
        SELECT project.pid, task.startdate AS task_start_date, project.start AS project_start_date, task.deadline AS task_end_date, project.finish AS project_end_date
        FROM task
        LEFT JOIN project ON task.pid = project.pid
        WHERE task.tid = ?;
    `;

    db.query(getProjectSql, [taskId], (error, results) => {
        if (error) {
            console.error('Error getting project of the task from DB', error);
            return res.status(500).send({ data: { taskId: taskId, message: 'Error getting project of the task from DB'} });
        }

        const result = results[0]

        // if task.startDate < project.startDate -> update also the project's start date
        if (result.task_start_date < result.project_start_date) {
            const updateProjectStartSql = `
                UPDATE project
                SET start = ?
                WHERE pid = ?;
            `;
            // Update project in the DB
            db.query(updateProjectStartSql, [start, result.pid], (error, projectStartResult) => {
                if (error) {
                    console.error('Error updating project start date:', error);
                    return res.status(500).send({ data: { taskId: taskId, message: 'Error updating project start date'} });
                }

                console.log(`Project ${result.pid} start date updated successfully`);
            });
        }

        // if task.endDate > project.endDate -> update also the project's end date
        if (result.task_end_date > result.project_end_date) {
            const updateProjectEndSql = `
                UPDATE project
                SET finish = ?
                WHERE pid = ?;
            `;
            // Update project in the DB
            db.query(updateProjectEndSql, [end, result.pid], (error, projectEndResult) => {
                if (error) {
                    console.error('Error updating project end date:', error);
                    return res.status(500).send({ data: { taskId: taskId, message: 'Error updating project end date'} });
                }

                console.log(`Project ${result.pid} end date updated successfully`);
            });
        }
    });

    res.status(200).send({ data: { taskId: taskId, message: 'Task updated successfully' } });
});

// // DELETE endpoint to delete a specific task
// app.delete('/api/tasks/:id', (req, res) => {
//     const taskId = req.params.id;

//     const sql = `DELETE FROM task WHERE tid = ?`;

//     db.query(sql, [taskId], (error, result) => {
//         if (error) {
//             console.error('Error deleting task:', error);
//             return res.status(500).send('Error deleting task');
//         }

//         console.log(`Task ${taskId} deleted successfully`);
//         res.status(200).send(`Task ${taskId} deleted successfully`);
//     });
// });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



