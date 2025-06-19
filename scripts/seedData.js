const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Task = require('../models/Task');
const connectDB = require('../config/database');

// Sample tasks data
const sampleTasks = [
  {
    title: "Setup development environment",
    description: "Install Node.js, MongoDB, and configure the development environment for the task management application.",
    status: "completed",
    priority: "high",
    dueDate: new Date('2024-01-15'),
    tags: ["development", "setup", "environment"]
  },
  {
    title: "Design database schema",
    description: "Create a comprehensive database schema for the task management system including all necessary fields and relationships.",
    status: "completed",
    priority: "high",
    dueDate: new Date('2024-01-20'),
    tags: ["database", "schema", "design"]
  },
  {
    title: "Implement user authentication",
    description: "Develop secure user authentication system with JWT tokens, password hashing, and session management.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date('2024-02-01'),
    tags: ["authentication", "security", "jwt"]
  },
  {
    title: "Create API documentation",
    description: "Write comprehensive API documentation including endpoint descriptions, request/response examples, and usage instructions.",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date('2024-01-25'),
    tags: ["documentation", "api", "readme"]
  },
  {
    title: "Build React frontend",
    description: "Develop a responsive React frontend application with components for task management, including forms and lists.",
    status: "pending",
    priority: "medium",
    dueDate: new Date('2024-02-15'),
    tags: ["frontend", "react", "ui"]
  },
  {
    title: "Implement task filtering",
    description: "Add advanced filtering capabilities to allow users to filter tasks by status, priority, date, and custom criteria.",
    status: "pending",
    priority: "medium",
    dueDate: new Date('2024-02-10'),
    tags: ["filtering", "search", "functionality"]
  },
  {
    title: "Add email notifications",
    description: "Implement email notification system for task reminders, due date alerts, and status change notifications.",
    status: "pending",
    priority: "low",
    dueDate: new Date('2024-02-20'),
    tags: ["notifications", "email", "alerts"]
  },
  {
    title: "Optimize database queries",
    description: "Review and optimize database queries for better performance, add indexes, and implement query caching.",
    status: "pending",
    priority: "low",
    dueDate: new Date('2024-02-25'),
    tags: ["optimization", "performance", "database"]
  },
  {
    title: "Write unit tests",
    description: "Create comprehensive unit tests for all API endpoints, controllers, and utility functions to ensure code reliability.",
    status: "pending",
    priority: "high",
    dueDate: new Date('2024-02-05'),
    tags: ["testing", "unit-tests", "quality"]
  },
  {
    title: "Deploy to production",
    description: "Deploy the application to production environment with proper CI/CD pipeline, monitoring, and logging.",
    status: "pending",
    priority: "urgent",
    dueDate: new Date('2024-03-01'),
    tags: ["deployment", "production", "devops"]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🗑️  Clearing existing tasks...');
    await Task.deleteMany({});
    
    console.log('🌱 Seeding database with sample tasks...');
    const createdTasks = await Task.insertMany(sampleTasks);
    
    console.log(`✅ Successfully created ${createdTasks.length} sample tasks`);
    
    // Display summary
    const statusCounts = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityCounts = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Database Summary:');
    console.log('Status Distribution:');
    statusCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count} tasks`);
    });
    
    console.log('\nPriority Distribution:');
    priorityCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count} tasks`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('You can now start the server and test the API endpoints.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleTasks }; 