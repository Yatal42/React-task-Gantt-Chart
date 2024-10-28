// src/controllers/taskController.js

const db = require('../db');
// src/controllers/taskController.js

// GET all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT tid, title, startdate, deadline, pid, descriptionText, dependencies, progress
            FROM task;
        `);

        const tasks = rows.map(task => {
            let dependencies = [];
            if (task.dependencies) {
                try {
                    dependencies = JSON.parse(task.dependencies);
                } catch (e) {
                    console.error(`Error parsing dependencies for task ${task.tid}:`, e);
                    dependencies = [];
                }
            }

            return {
                tid: task.tid,
                title: task.title,
                startdate: task.startdate,
                deadline: task.deadline,
                pid: task.pid,
                descriptionText: task.descriptionText,
                dependencies: dependencies,
                progress: task.progress
            };
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// GET tasks for a specific project
exports.getTasksByProject = async (req, res) => {
    const projectId = req.params.pid;
    console.log(`Fetching tasks for project ID: ${projectId}`);

    try {
        const [rows] = await db.query(`
            SELECT tid, title, startdate, deadline, pid, descriptionText, dependencies, progress
            FROM task
            WHERE pid = ?;
        `, [projectId]);

        const tasks = rows.map(task => {
            let dependencies = [];
            if (task.dependencies) {
                try {
                    dependencies = JSON.parse(task.dependencies);
                } catch (e) {
                    console.error(`Error parsing dependencies for task ${task.tid}:`, e);
                    dependencies = [];
                }
            }

            return {
                tid: task.tid,
                title: task.title,
                startdate: task.startdate,
                deadline: task.deadline,
                pid: task.pid,
                descriptionText: task.descriptionText,
                dependencies: dependencies,
                progress: task.progress
            };
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks for project:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// POST add a new task
exports.createTask = async (req, res) => {
    const { title, startdate, deadline, pid, descriptionText, dependencies } = req.body;
  
    try {
      const formattedStart = new Date(startdate).toISOString().split('T')[0];
      const formattedEnd = new Date(deadline).toISOString().split('T')[0];
      const dependenciesJson = JSON.stringify(dependencies || []);
  
      const [result] = await db.query(`
        INSERT INTO task (title, startdate, deadline, pid, descriptionText, dependencies)
        VALUES (?, DATE(?), DATE(?), ?, ?, ?);
      `, [title, formattedStart, formattedEnd, pid, descriptionText, dependenciesJson]);
  
      res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ message: 'Error adding task', error });
    }
  };

// PUT update an existing task
exports.updateTask = async (req, res) => {
    const taskId = req.params.tid;
    const { title, startdate, deadline, pid, descriptionText, dependencies, progress } = req.body;

    try {
        const formattedStart = new Date(startdate).toISOString().split('T')[0];
        const formattedEnd = new Date(deadline).toISOString().split('T')[0];
        const parsedProgress = typeof progress === 'number' ? progress : parseInt(progress, 10) || 0;
        const dependenciesJson = JSON.stringify(dependencies || []);

        const [result] = await db.query(`
            UPDATE task
            SET title = ?, startdate = DATE(?), deadline = DATE(?), pid = ?, 
                descriptionText = ?, dependencies = ?, progress = ?
            WHERE tid = ?;
        `, [title, formattedStart, formattedEnd, pid, descriptionText, dependenciesJson, parsedProgress, taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
    const taskId = req.params.tid;

    try {
        const [result] = await db.query(`
            DELETE FROM task
            WHERE tid = ?;
        `, [taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error });
    }
};