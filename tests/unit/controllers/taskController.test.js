const mongoose = require('mongoose');
const Task = require('../../../models/Task');
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../../../controllers/taskController');

// Mock Task model for some tests
jest.mock('../../../models/Task', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn()
}));

describe('Task Controller Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getAllTasks - Mocked Tests', () => {
    test('should get all tasks with default pagination', async () => {
      const mockTasks = [
        { _id: '1', title: 'Task 1', description: 'Description 1' },
        { _id: '2', title: 'Task 2', description: 'Description 2' }
      ];

      // Mock the chained methods
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks)
      };

      Task.find.mockReturnValue(mockQuery);
      Task.countDocuments.mockResolvedValue(2);

      await getAllTasks(req, res, next);

      expect(Task.find).toHaveBeenCalledWith({});
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        total: 2,
        currentPage: 1,
        totalPages: 1,
        data: mockTasks
      });
    });

    test('should filter tasks by status and priority', async () => {
      req.query = { status: 'completed', priority: 'high' };
      
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };

      Task.find.mockReturnValue(mockQuery);
      Task.countDocuments.mockResolvedValue(0);

      await getAllTasks(req, res, next);

      expect(Task.find).toHaveBeenCalledWith({
        status: 'completed',
        priority: 'high'
      });
    });

    test('should handle search functionality', async () => {
      req.query = { search: 'test' };
      
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };

      Task.find.mockReturnValue(mockQuery);
      Task.countDocuments.mockResolvedValue(0);

      await getAllTasks(req, res, next);

      expect(Task.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } }
        ]
      });
    });

    test('should handle pagination correctly', async () => {
      req.query = { page: '2', limit: '5' };
      
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };

      Task.find.mockReturnValue(mockQuery);
      Task.countDocuments.mockResolvedValue(15);

      await getAllTasks(req, res, next);

      expect(mockQuery.skip).toHaveBeenCalledWith(5); // (page 2 - 1) * limit 5
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPage: 2,
          totalPages: 3
        })
      );
    });

    test('should handle database errors', async () => {
      const mockError = new Error('Database connection error');
      Task.find.mockImplementation(() => {
        throw mockError;
      });

      await getAllTasks(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getTask - Mocked Tests', () => {
    test('should get a single task by ID', async () => {
      const mockTask = { _id: '507f1f77bcf86cd799439011', title: 'Test Task' };
      req.params.id = '507f1f77bcf86cd799439011';

      Task.findById.mockResolvedValue(mockTask);

      await getTask(req, res, next);

      expect(Task.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTask
      });
    });

    test('should handle task not found', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      Task.findById.mockResolvedValue(null);

      await getTask(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Task not found with id: 507f1f77bcf86cd799439011',
          statusCode: 404
        })
      );
    });
  });

  describe('createTask - Mocked Tests', () => {
    test('should create a new task', async () => {
      const mockTaskData = {
        title: 'New Task',
        description: 'This is a new task description'
      };
      const mockCreatedTask = { _id: '507f1f77bcf86cd799439011', ...mockTaskData };

      req.body = mockTaskData;
      Task.create.mockResolvedValue(mockCreatedTask);

      await createTask(req, res, next);

      expect(Task.create).toHaveBeenCalledWith(mockTaskData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task created successfully',
        data: mockCreatedTask
      });
    });

    test('should handle validation errors during creation', async () => {
      const mockError = new Error('Validation failed');
      req.body = { title: 'Short' }; // Invalid data

      Task.create.mockRejectedValue(mockError);

      await createTask(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateTask - Mocked Tests', () => {
    test('should update an existing task', async () => {
      const mockUpdatedTask = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Updated Task',
        description: 'Updated description'
      };

      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { title: 'Updated Task' };

      Task.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

      await updateTask(req, res, next);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { title: 'Updated Task' },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task updated successfully',
        data: mockUpdatedTask
      });
    });

    test('should handle task not found during update', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { title: 'Updated Task' };

      Task.findByIdAndUpdate.mockResolvedValue(null);

      await updateTask(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Task not found with id: 507f1f77bcf86cd799439011',
          statusCode: 404
        })
      );
    });
  });

  describe('deleteTask - Mocked Tests', () => {
    test('should delete an existing task', async () => {
      const mockTask = { _id: '507f1f77bcf86cd799439011', title: 'Task to delete' };

      req.params.id = '507f1f77bcf86cd799439011';
      Task.findById.mockResolvedValue(mockTask);
      Task.findByIdAndDelete.mockResolvedValue(mockTask);

      await deleteTask(req, res, next);

      expect(Task.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task deleted successfully',
        data: {}
      });
    });

    test('should handle task not found during delete', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      Task.findById.mockResolvedValue(null);

      await deleteTask(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Task not found with id: 507f1f77bcf86cd799439011',
          statusCode: 404
        })
      );
    });
  });

  describe('getTaskStats - Mocked Tests', () => {
    test('should get task statistics', async () => {
      const mockStatusStats = [
        { _id: 'pending', count: 5, avgPriority: 2 },
        { _id: 'completed', count: 3, avgPriority: 2.5 }
      ];
      const mockPriorityStats = [
        { _id: 'medium', count: 4 },
        { _id: 'high', count: 3 }
      ];

      Task.aggregate
        .mockResolvedValueOnce(mockStatusStats)
        .mockResolvedValueOnce(mockPriorityStats);
      Task.countDocuments.mockResolvedValue(8);

      await getTaskStats(req, res, next);

      expect(Task.aggregate).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          statusStats: mockStatusStats,
          priorityStats: mockPriorityStats,
          totalTasks: 8
        }
      });
    });

    test('should handle errors in statistics calculation', async () => {
      const mockError = new Error('Aggregation error');
      Task.aggregate.mockRejectedValue(mockError);

      await getTaskStats(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});

// Non-mocked integration-style unit tests
describe('Task Controller Unit Tests - Non-Mocked Database', () => {
  let req, res, next;

  // Use the real Task model for these tests
  const RealTask = require('../../../models/Task');

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Non-Mocked Controller Tests', () => {
    test('should create and retrieve task with real database', async () => {
      // Create a task using real model
      const taskData = {
        title: 'Real Task Test',
        description: 'This is a real task for testing controller'
      };

      const createdTask = await RealTask.create(taskData);
      expect(createdTask._id).toBeDefined();
      expect(createdTask.title).toBe(taskData.title);

      // Test getTask controller with real data
      req.params.id = createdTask._id.toString();

      // Import the real controller (not mocked)
      const realController = require('../../../controllers/taskController');
      await realController.getTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          title: taskData.title,
          description: taskData.description
        })
      });
    });

    test('should handle real database validation errors', async () => {
      req.body = {
        title: 'Ab', // Too short
        description: 'Short' // Too short
      };

      const realController = require('../../../controllers/taskController');
      await realController.createTask(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'ValidationError'
        })
      );
    });

    test('should handle real ObjectId cast errors', async () => {
      req.params.id = 'invalid-object-id';

      const realController = require('../../../controllers/taskController');
      await realController.getTask(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'CastError'
        })
      );
    });
  });
});