const mongoose = require('mongoose');
const Task = require('../../../models/Task');

describe('Task Model Unit Tests', () => {
  describe('Task Model Validation', () => {
    test('should create a valid task with required fields', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask._id).toBeDefined();
      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBe(taskData.description);
      expect(savedTask.status).toBe('pending'); // default value
      expect(savedTask.priority).toBe('medium'); // default value
      expect(savedTask.createdAt).toBeDefined();
      expect(savedTask.updatedAt).toBeDefined();
    });

    test('should create task with all optional fields', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const taskData = {
        title: 'Complete Task',
        description: 'This is a complete task with all fields',
        status: 'in-progress',
        priority: 'high',
        dueDate: futureDate,
        tags: ['work', 'urgent']
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBe(taskData.description);
      expect(savedTask.status).toBe(taskData.status);
      expect(savedTask.priority).toBe(taskData.priority);
      expect(savedTask.dueDate).toEqual(taskData.dueDate);
      expect(savedTask.tags).toEqual(taskData.tags);
    });

    test('should fail validation without title', async () => {
      const taskData = {
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Task title is required/);
    });

    test('should fail validation without description', async () => {
      const taskData = {
        title: 'Test Task'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Task description is required/);
    });

    test('should fail validation with title too short', async () => {
      const taskData = {
        title: 'Ab', // Only 2 characters
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Title must be at least 3 characters long/);
    });

    test('should fail validation with title too long', async () => {
      const taskData = {
        title: 'A'.repeat(101), // 101 characters
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Title cannot exceed 100 characters/);
    });

    test('should fail validation with description too short', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Short' // Only 5 characters
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Description must be at least 10 characters long/);
    });

    test('should fail validation with description too long', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'A'.repeat(501) // 501 characters
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Description cannot exceed 500 characters/);
    });

    test('should fail validation with invalid status', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        status: 'invalid-status'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Status must be one of/);
    });

    test('should fail validation with invalid priority', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        priority: 'invalid-priority'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Priority must be one of/);
    });

    test('should fail validation with past due date', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        dueDate: pastDate
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow(/Due date must be in the future/);
    });
  });

  describe('Task Model Virtuals', () => {
    test('should calculate ageInDays virtual correctly', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.ageInDays).toBe(0); // Should be 0 for a just created task
    });

    test('should calculate daysUntilDue virtual correctly', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        dueDate: futureDate
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.daysUntilDue).toBe(7);
    });

    test('should return null for daysUntilDue when no due date', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.daysUntilDue).toBeNull();
    });
  });

  describe('Task Model Middleware', () => {
    test('should update updatedAt field on save', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();
      const originalUpdatedAt = savedTask.updatedAt;

      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 10));
      savedTask.title = 'Updated Test Task';
      const updatedTask = await savedTask.save();

      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Task Model Methods', () => {
    test('should return JSON with virtuals', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        dueDate: futureDate
      };

      const task = new Task(taskData);
      const savedTask = await task.save();
      const taskJSON = savedTask.toJSON();

      expect(taskJSON.ageInDays).toBeDefined();
      expect(taskJSON.daysUntilDue).toBeDefined();
    });
  });

  describe('Task Model Edge Cases', () => {
    test('should trim title and handle whitespace', async () => {
      const taskData = {
        title: '  Test Task  ',
        description: 'This is a test task description that is long enough'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.title).toBe('Test Task');
    });

    test('should handle empty tags array', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        tags: []
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.tags).toEqual([]);
    });

    test('should convert tags to lowercase', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task description that is long enough',
        tags: ['WORK', 'Urgent', 'Personal']
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.tags).toEqual(['work', 'urgent', 'personal']);
    });
  });
}); 