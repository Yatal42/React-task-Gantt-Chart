const db = require('../db');

exports.getTodos = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM todo;`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Error fetching todos', error });
    }
};

exports.addTodo = async (req, res) => {
    const { task } = req.body;
    try {
        const [result] = await db.query(`INSERT INTO todo (task) VALUES (?);`, [task]);
        res.status(201).json({ id: result.insertId, task, completed: false });
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ message: 'Error adding todo', error });
    }
};

exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    let setClause = [];
    let values = [];

    if (task !== undefined) {
        setClause.push('task = ?');
        values.push(task);
    }

    if (completed !== undefined) {
        setClause.push('completed = ?');
        values.push(completed);
    }

    if (setClause.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);

    const sql = `UPDATE todo SET ${setClause.join(', ')} WHERE id = ?;`;

    try {
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Error updating todo', error });
    }
};

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(`DELETE FROM todo WHERE id = ?;`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Error deleting todo', error });
    }
};