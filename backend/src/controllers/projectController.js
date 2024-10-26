const db = require('../db');

// GET all projects
exports.getAllProjects = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM project');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

// POST create a new project
exports.createProject = async (req, res) => {
    const { title, start } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO project (title, start) VALUES (?, DATE(?))',
            [title, start]
        );
        res.status(201).json({ message: 'Project created successfully', projectId: result.insertId });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error });
    }
};

// PUT update a project
exports.updateProject = async (req, res) => {
    const projectId = req.params.pid;
    const { title, start } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE project SET title = ?, start = DATE(?) WHERE pid = ?',
            [title, start, projectId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error });
    }
};

// DELETE a project
exports.deleteProject = async (req, res) => {
    const projectId = req.params.pid;

    try {
        const [result] = await db.query(
            'DELETE FROM project WHERE pid = ?',
            [projectId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error });
    }
};