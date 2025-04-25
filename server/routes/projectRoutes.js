const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET all projects
router.get('/', projectController.getAllProjects);

// GET a single project by ID
router.get('/:id', projectController.getProject);

// POST create a new project
router.post('/', projectController.createProject);

// PUT update a project
router.put('/:id', projectController.updateProject);

// DELETE a project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
