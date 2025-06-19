const express = require('express');
const router = express.Router();

// Import middleware
const { validateCreateTask, validateUpdateTask } = require('../middleware/validation');

// Import controller functions
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Public
router.get('/stats', getTaskStats);

// @route   GET /api/tasks
// @desc    Get all tasks with optional filtering and pagination
// @access  Public
// Query parameters:
// - status: filter by task status
// - priority: filter by task priority
// - page: page number for pagination (default: 1)
// - limit: number of items per page (default: 10)
// - sort: field to sort by (default: createdAt)
// - order: sort order 'asc' or 'desc' (default: desc)
// - search: search in title and description
router.get('/', getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Public
router.get('/:id', getTask);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Public
// Body: { title, description, status?, priority?, dueDate?, tags? }
router.post('/', validateCreateTask, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update an existing task
// @access  Public
// Body: { title?, description?, status?, priority?, dueDate?, tags? }
router.put('/:id', validateUpdateTask, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Public
router.delete('/:id', deleteTask);

module.exports = router; 