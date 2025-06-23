const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Task = require('../../models/Task');

describe('Task Management API Tests', () => {
  let server;

  beforeAll(async () => {
    // Start the server for API testing
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('API Contract Validation', () => {
    test('POST /api/tasks should return correct response structure', async () => {
      const taskData = {
        title: 'API Test Task',
        description: 'Testing API response structure compliance'
      };

      const response = await request(server)
        .post('/api/tasks')
        .send(taskData)
        .expect(201)
        .expect('Content-Type', /json/);

      // Validate response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Task created successfully');
      expect(response.body).toHaveProperty('data');
      
      // Validate task data structure
      const taskResponseData = response.body.data;
      expect(taskResponseData).toHaveProperty('_id');
      expect(taskResponseData).toHaveProperty('title');
      expect(taskResponseData).toHaveProperty('description');
      expect(taskResponseData).toHaveProperty('status');
      expect(taskResponseData).toHaveProperty('priority');
      expect(taskResponseData).toHaveProperty('createdAt');
      expect(taskResponseData).toHaveProperty('updatedAt');
      
      // Validate data types
      expect(typeof taskResponseData._id).toBe('string');
      expect(typeof taskResponseData.title).toBe('string');
      expect(typeof taskResponseData.description).toBe('string');
      expect(['pending', 'in-progress', 'completed', 'cancelled']).toContain(taskResponseData.status);
      expect(['low', 'medium', 'high', 'urgent']).toContain(taskResponseData.priority);
    });

    test('GET /api/tasks should return correct pagination structure', async () => {
      const response = await request(server)
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /json/);

      // Validate pagination structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('data');
      
      // Validate data types
      expect(typeof response.body.count).toBe('number');
      expect(typeof response.body.total).toBe('number');
      expect(typeof response.body.currentPage).toBe('number');
      expect(typeof response.body.totalPages).toBe('number');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Error responses should have consistent structure', async () => {
      const response = await request(server)
        .post('/api/tasks')
        .send({ title: 'Short' }) // Invalid data
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('HTTP Methods and Status Codes', () => {
    let testTaskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'HTTP Test Task',
        description: 'Task for testing HTTP methods and status codes'
      });
      testTaskId = task._id.toString();
    });

    test('POST /api/tasks should return 201 for successful creation', async () => {
      await request(server)
        .post('/api/tasks')
        .send({
          title: 'New Task for Status Test',
          description: 'Testing 201 status code for task creation'
        })
        .expect(201);
    });

    test('GET /api/tasks should return 200 for successful retrieval', async () => {
      await request(server)
        .get('/api/tasks')
        .expect(200);
    });

    test('GET /api/tasks/:id should return 200 for existing task', async () => {
      await request(server)
        .get(`/api/tasks/${testTaskId}`)
        .expect(200);
    });

    test('GET /api/tasks/:id should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(server)
        .get(`/api/tasks/${nonExistentId}`)
        .expect(404);
    });

    test('PUT /api/tasks/:id should return 200 for successful update', async () => {
      await request(server)
        .put(`/api/tasks/${testTaskId}`)
        .send({ title: 'Updated Task Title' })
        .expect(200);
    });

    test('PUT /api/tasks/:id should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(server)
        .put(`/api/tasks/${nonExistentId}`)
        .send({ title: 'Updated Title' })
        .expect(404);
    });

    test('DELETE /api/tasks/:id should return 200 for successful deletion', async () => {
      await request(server)
        .delete(`/api/tasks/${testTaskId}`)
        .expect(200);
    });

    test('DELETE /api/tasks/:id should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(server)
        .delete(`/api/tasks/${nonExistentId}`)
        .expect(404);
    });

    test('GET /api/tasks/stats should return 200', async () => {
      await request(server)
        .get('/api/tasks/stats')
        .expect(200);
    });
  });

  describe('Request Validation', () => {
    test('should reject POST request with missing required fields', async () => {
      const responses = await Promise.all([
        request(server).post('/api/tasks').send({}),
        request(server).post('/api/tasks').send({ title: 'Only Title' }),
        request(server).post('/api/tasks').send({ description: 'Only Description' })
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Validation error');
      });
    });

    test('should reject requests with invalid field values', async () => {
      const invalidRequests = [
        { title: 'AB', description: 'Valid description for testing' }, // Title too short
        { title: 'Valid Title', description: 'Short' }, // Description too short
        { title: 'Valid Title', description: 'Valid description', status: 'invalid' }, // Invalid status
        { title: 'Valid Title', description: 'Valid description', priority: 'invalid' } // Invalid priority
      ];

      for (const invalidData of invalidRequests) {
        const response = await request(server)
          .post('/api/tasks')
          .send(invalidData);
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      }
    });

    test('should accept valid enum values for status and priority', async () => {
      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      const validPriorities = ['low', 'medium', 'high', 'urgent'];

      for (const status of validStatuses) {
        for (const priority of validPriorities) {
          const response = await request(server)
            .post('/api/tasks')
            .send({
              title: `Task with ${status} status and ${priority} priority`,
              description: 'Testing valid enum values for status and priority',
              status,
              priority
            });
          
          expect(response.status).toBe(201);
          expect(response.body.data.status).toBe(status);
          expect(response.body.data.priority).toBe(priority);
        }
      }
    });
  });

  describe('Query Parameters Validation', () => {
    beforeEach(async () => {
      // Create test data for query parameter testing
      const testTasks = [
        { title: 'High Priority Task', description: 'High priority task for testing', priority: 'high', status: 'pending' },
        { title: 'Medium Priority Task', description: 'Medium priority task for testing', priority: 'medium', status: 'in-progress' },
        { title: 'Low Priority Task', description: 'Low priority task for testing', priority: 'low', status: 'completed' },
        { title: 'Urgent Task', description: 'Urgent task for testing', priority: 'urgent', status: 'cancelled' }
      ];
      await Task.insertMany(testTasks);
    });

    test('should filter by status query parameter', async () => {
      const statuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      
      for (const status of statuses) {
        const response = await request(server)
          .get(`/api/tasks?status=${status}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        if (response.body.data.length > 0) {
          expect(response.body.data.every(task => task.status === status)).toBe(true);
        }
      }
    });

    test('should filter by priority query parameter', async () => {
      const priorities = ['low', 'medium', 'high', 'urgent'];
      
      for (const priority of priorities) {
        const response = await request(server)
          .get(`/api/tasks?priority=${priority}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        if (response.body.data.length > 0) {
          expect(response.body.data.every(task => task.priority === priority)).toBe(true);
        }
      }
    });

    test('should handle pagination parameters correctly', async () => {
      const paginationTests = [
        { page: 1, limit: 2 },
        { page: 2, limit: 1 },
        { page: 1, limit: 10 }
      ];

      for (const { page, limit } of paginationTests) {
        const response = await request(server)
          .get(`/api/tasks?page=${page}&limit=${limit}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.currentPage).toBe(page);
        expect(response.body.data.length).toBeLessThanOrEqual(limit);
      }
    });

    test('should handle sorting parameters correctly', async () => {
      const sortTests = [
        { sort: 'title', order: 'asc' },
        { sort: 'title', order: 'desc' },
        { sort: 'createdAt', order: 'asc' },
        { sort: 'priority', order: 'desc' }
      ];

      for (const { sort, order } of sortTests) {
        const response = await request(server)
          .get(`/api/tasks?sort=${sort}&order=${order}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        // If we have multiple tasks, check sorting
        if (response.body.data.length > 1) {
          const sortedData = response.body.data;
          for (let i = 1; i < sortedData.length; i++) {
            if (order === 'asc') {
              expect(sortedData[i][sort] >= sortedData[i-1][sort]).toBe(true);
            } else {
              expect(sortedData[i][sort] <= sortedData[i-1][sort]).toBe(true);
            }
          }
        }
      }
    });

    test('should handle search query parameter', async () => {
      const searchTerms = ['High', 'Medium', 'testing', 'priority'];
      
      for (const search of searchTerms) {
        const response = await request(server)
          .get(`/api/tasks?search=${search}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        if (response.body.data.length > 0) {
          expect(
            response.body.data.some(task => 
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description.toLowerCase().includes(search.toLowerCase())
            )
          ).toBe(true);
        }
      }
    });
  });

  describe('Content-Type Headers', () => {
    test('should accept and return JSON content type', async () => {
      const response = await request(server)
        .post('/api/tasks')
        .set('Content-Type', 'application/json')
        .send({
          title: 'Content Type Test',
          description: 'Testing content type handling'
        })
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toBeDefined();
    });

    test('should handle requests without content-type header', async () => {
      const response = await request(server)
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeDefined();
    });
  });

  describe('API Endpoint Coverage', () => {
    test('should have all required CRUD endpoints available', async () => {
      // Test that all endpoints are defined and accessible
      const endpointTests = [
        { method: 'get', path: '/api/tasks', expectedStatus: 200 },
        { method: 'post', path: '/api/tasks', expectedStatus: 400, data: {} }, // Expect validation error
        { method: 'get', path: '/api/tasks/stats', expectedStatus: 200 },
        { method: 'get', path: '/health', expectedStatus: 200 },
        { method: 'get', path: '/api', expectedStatus: 200 }
      ];

      for (const { method, path, expectedStatus, data } of endpointTests) {
        const req = request(server)[method](path);
        if (data) {
          req.send(data);
        }
        await req.expect(expectedStatus);
      }
    });
  });

  describe('Response Time and Performance', () => {
    test('API endpoints should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await request(server)
        .get('/api/tasks')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    test('Task creation should be reasonably fast', async () => {
      const startTime = Date.now();
      
      await request(server)
        .post('/api/tasks')
        .send({
          title: 'Performance Test Task',
          description: 'Testing task creation performance'
        })
        .expect(201);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(3000); // Should create within 3 seconds
    });
  });

  describe('API Documentation Endpoint', () => {
    test('should provide API documentation', async () => {
      const response = await request(server)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task Management API');
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints.tasks).toBeDefined();
      
      // Verify all expected endpoints are documented
      const taskEndpoints = response.body.endpoints.tasks;
      expect(taskEndpoints['GET /api/tasks']).toBeDefined();
      expect(taskEndpoints['GET /api/tasks/:id']).toBeDefined();
      expect(taskEndpoints['POST /api/tasks']).toBeDefined();
      expect(taskEndpoints['PUT /api/tasks/:id']).toBeDefined();
      expect(taskEndpoints['DELETE /api/tasks/:id']).toBeDefined();
      expect(taskEndpoints['GET /api/tasks/stats']).toBeDefined();
    });
  });

  describe('Error Response Consistency', () => {
    test('all error responses should follow the same format', async () => {
      const errorRequests = [
        request(server).get('/api/tasks/invalid-id'),
        request(server).post('/api/tasks').send({}),
        request(server).put('/api/tasks/invalid-id').send({ title: 'Test' }),
        request(server).delete('/api/tasks/invalid-id'),
        request(server).get('/api/non-existent-route')
      ];

      const responses = await Promise.allSettled(errorRequests);
      
      responses.forEach((result) => {
        if (result.status === 'fulfilled') {
          const response = result.value;
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('message');
          expect(typeof response.body.message).toBe('string');
        }
      });
    });
  });
});