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
    user: '',
    password: '',
    database: ''
});

app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM task LIMIT 12';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        const tasks = results.map((task) => {
            return {
                id: task.tid,
                nameAndTitle: task.title,
                start: task.startdate,
                end: task.deadline,
                type: task.stage,


            }
        })

        res.status(200).json(tasks);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

  // "scripts": {
  //   "start": "concurrently \"npm start-client\" \"npm start-server\"",
  //   "start-client": "react-scripts start",
  //   "start-server": "node server.js",
  //   // other scripts...
  // }

