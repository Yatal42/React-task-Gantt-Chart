const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { body, validationResult } = require('express-validator');

router.get('/', projectController.getAllProjects);

router.post('/',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('start').isISO8601().withMessage('Start date must be a valid date'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        projectController.createProject(req, res);
    }
);

router.put('/:pid',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('start').isISO8601().withMessage('Start date must be a valid date'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        projectController.updateProject(req, res);
    }
);

router.delete('/:pid', projectController.deleteProject);

router.get('/:pid/tasks', taskController.getTasksByProject);


module.exports = router;