const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Task = require('../../models/Task');

describe('Task API Integration Tests', () => {
  let server;

  beforeAll(async () => {
    // Start the server
    server = app.listen(0); // Use port 0 to let the system choose an available port
  });

  afterAll(async () => {
    // Close server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('POST /api/tasks', () => {
    test('should create a new task successfully', async () => {
      const taskData = {
        title: 'Integration Test Task',
        description: 'This is a task created during integration testing',
        priority: 'high',
        status: 'pending'
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.priority).toBe(taskData.priority);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data._id).toBeDefined();

      // Verify task was actually saved to database
      const savedTask = await Task.findById(response.body.data._id);
      expect(savedTask).toBeTruthy();
      expect(savedTask.title).toBe(taskData.title);
    });

    test('should create task with minimal required fields', async () => {
      const taskData = {
        title: 'Minimal Task',
        description: 'This task has only required fields'
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending'); // Default value
      expect(response.body.data.priority).toBe('medium'); // Default value
    });

    test('should fail to create task with invalid data', async () => {
      const invalidTaskData = {
        title: 'Ab', // Too short
        description: 'Short' // Too short
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(invalidTaskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    test('should fail to create task without required fields', async () => {
      const incompleteTaskData = {
        title: 'Task without description'
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(incompleteTaskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    test('should create task with future due date', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const taskData = {
        title: 'Task with Due Date',
        description: 'This task has a due date in the future',
        dueDate: futureDate.toISOString()
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(new Date(response.body.data.dueDate)).toEqual(futureDate);
    });

    test('should fail to create task with past due date', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      const taskData = {
        title: 'Task with Past Due Date',
        description: 'This task has a past due date and should fail',
        dueDate: pastDate.toISOString()
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create some test tasks
      const testTasks = [
        {
          title: 'First Task',
          description: 'First task description for testing',
          status: 'pending',
          priority: 'high'
        },
        {
          title: 'Second Task',
          description: 'Second task description for testing',
          status: 'completed',
          priority: 'medium'
        },
        {
          title: 'Third Task',
          description: 'Third task description for testing',
          status: 'in-progress',
          priority: 'low'
        }
      ];

      await Task.insertMany(testTasks);
    });

    test('should get all tasks with default pagination', async () => {
      const response = await request(server)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.count).toBeDefined();
      expect(response.body.total).toBeDefined();
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBeDefined();
    });

    test('should filter tasks by status', async () => {
      const response = await request(server)
        .get('/api/tasks?status=completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(task => task.status === 'completed')).toBe(true);
    });

    test('should filter tasks by priority', async () => {
      const response = await request(server)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(task => task.priority === 'high')).toBe(true);
    });

    test('should search tasks by title and description', async () => {
      const response = await request(server)
        .get('/api/tasks?search=First')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(
        response.body.data.some(task => 
          task.title.includes('First') || task.description.includes('First')
        )
      ).toBe(true);
    });

    test('should handle pagination correctly', async () => {
      const response = await request(server)
        .get('/api/tasks?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.currentPage).toBe(1);
    });

    test('should sort tasks by different fields', async () => {
      const response = await request(server)
        .get('/api/tasks?sort=title&order=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      
      if (response.body.data.length > 1) {
        // Check if tasks are sorted by title in ascending order
        for (let i = 1; i < response.body.data.length; i++) {
          expect(response.body.data[i].title >= response.body.data[i-1].title).toBe(true);
        }
      }
    });
  });

  describe('GET /api/tasks/:id', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Single Task Test',
        description: 'This task is for testing single task retrieval'
      });
    });

    test('should get a single task by ID', async () => {
      const response = await request(server)
        .get(`/api/tasks/${testTask._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(testTask._id.toString());
      expect(response.body.data.title).toBe(testTask.title);
      expect(response.body.data.description).toBe(testTask.description);
    });

    test('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(server)
        .get(`/api/tasks/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Task not found');
    });

    test('should return 404 for invalid ObjectId', async () => {
      const response = await request(server)
        .get('/api/tasks/invalid-object-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Task to Update',
        description: 'This task will be updated during testing',
        status: 'pending',
        priority: 'medium'
      });
    });

    test('should update an existing task', async () => {
      const updateData = {
        title: 'Updated Task Title',
        status: 'completed',
        priority: 'high'
      };

      const response = await request(server)
        .put(`/api/tasks/${testTask._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);

      // Verify task was actually updated in database
      const updatedTask = await Task.findById(testTask._id);
      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.status).toBe(updateData.status);
    });

    test('should update only provided fields', async () => {
      const updateData = {
        status: 'in-progress'
      };

      const response = await request(server)
        .put(`/api/tasks/${testTask._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.title).toBe(testTask.title); // Should remain unchanged
      expect(response.body.data.description).toBe(testTask.description); // Should remain unchanged
    });

    test('should fail to update with invalid data', async () => {
      const invalidUpdateData = {
        title: 'Ab', // Too short
        status: 'invalid-status'
      };

      const response = await request(server)
        .put(`/api/tasks/${testTask._id}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });

    test('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(server)
        .put(`/api/tasks/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Task to Delete',
        description: 'This task will be deleted during testing'
      });
    });

    test('should delete an existing task', async () => {
      const response = await request(server)
        .delete(`/api/tasks/${testTask._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task was actually deleted from database
      const deletedTask = await Task.findById(testTask._id);
      expect(deletedTask).toBeNull();
    });

    test('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(server)
        .delete(`/api/tasks/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Task not found');
    });

    test('should return 404 for invalid ObjectId', async () => {
      const response = await request(server)
        .delete('/api/tasks/invalid-object-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/stats', () => {
    beforeEach(async () => {
      // Create test tasks with different statuses and priorities
      const testTasks = [
        { title: 'Task 1', description: 'Description 1', status: 'pending', priority: 'high' },
        { title: 'Task 2', description: 'Description 2', status: 'pending', priority: 'medium' },
        { title: 'Task 3', description: 'Description 3', status: 'completed', priority: 'low' },
        { title: 'Task 4', description: 'Description 4', status: 'in-progress', priority: 'urgent' },
        { title: 'Task 5', description: 'Description 5', status: 'completed', priority: 'medium' }
      ];

      await Task.insertMany(testTasks);
    });

    test('should get task statistics', async () => {
      const response = await request(server)
        .get('/api/tasks/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.statusStats).toBeDefined();
      expect(response.body.data.priorityStats).toBeDefined();
      expect(response.body.data.totalTasks).toBeDefined();
      expect(Array.isArray(response.body.data.statusStats)).toBe(true);
      expect(Array.isArray(response.body.data.priorityStats)).toBe(true);
      expect(typeof response.body.data.totalTasks).toBe('number');
    });

    test('should have correct statistics structure', async () => {
      const response = await request(server)
        .get('/api/tasks/stats')
        .expect(200);

      const { statusStats, priorityStats } = response.body.data;

      // Check status stats structure
      statusStats.forEach(stat => {
        expect(stat._id).toBeDefined();
        expect(typeof stat.count).toBe('number');
        expect(typeof stat.avgPriority).toBe('number');
      });

      // Check priority stats structure
      priorityStats.forEach(stat => {
        expect(stat._id).toBeDefined();
        expect(typeof stat.count).toBe('number');
      });
    });
  });

  describe('API Error Handling Integration', () => {
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(server)
        .get('/api/non-existent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Route /api/non-existent-endpoint not found');
    });

    test('should handle CORS preflight requests', async () => {
      const response = await request(server)
        .options('/api/tasks')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Health Check Integration', () => {
    test('should return health status', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task Management API is running');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });
  });

  describe('API Info Integration', () => {
    test('should return API information', async () => {
      const response = await request(server)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task Management API');
      expect(response.body.version).toBeDefined();
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints.tasks).toBeDefined();
    });
  });
});