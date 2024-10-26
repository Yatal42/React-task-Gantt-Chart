// src/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { body, validationResult } = require('express-validator');

// GET all tasks
router.get('/', taskController.getAllTasks);

// POST create a new task with validation
router.post('/',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('startdate').isISO8601().withMessage('Start date must be a valid date'),
        body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
        body('pid').isInt().withMessage('Project ID must be an integer'),
        body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be an integer between 0 and 100')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        taskController.createTask(req, res);
    }
);

// PUT update a task with validation
router.put('/:tid',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('startdate').isISO8601().withMessage('Start date must be a valid date'),
        body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
        body('pid').isInt().withMessage('Project ID must be an integer'),
        body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be an integer between 0 and 100')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        taskController.updateTask(req, res);
    }
);

// DELETE a task
router.delete('/:tid', taskController.deleteTask);

module.exports = router;