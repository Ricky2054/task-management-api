const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const taskRoutes = require('./routes/tasks');

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/tasks', taskRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      tasks: {
        'GET /api/tasks': 'Get all tasks with optional filtering and pagination',
        'GET /api/tasks/:id': 'Get a single task by ID',
        'POST /api/tasks': 'Create a new task',
        'PUT /api/tasks/:id': 'Update an existing task',
        'DELETE /api/tasks/:id': 'Delete a task',
        'GET /api/tasks/stats': 'Get task statistics'
      }
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// Handle 404 routes
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╭─────────────────────────────────────────╮
│     🚀 Task Management API Server       │
│                                         │
│  📡 Server running on port ${PORT}          │
│  🌍 Environment: ${process.env.NODE_ENV || 'development'}           │
│  📊 Health check: http://localhost:${PORT}/health  │
│  📚 API info: http://localhost:${PORT}/api      │
│                                         │
│  Ready to manage your tasks! 📝         │
╰─────────────────────────────────────────╯
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

module.exports = app; 