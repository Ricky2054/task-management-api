const { validateCreateTask, validateUpdateTask } = require('../../../middleware/validation');

describe('Validation Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateCreateTask', () => {
    test('should pass validation with valid task data', () => {
      req.body = {
        title: 'Valid Task Title',
        description: 'This is a valid task description that meets minimum length requirements',
        status: 'pending',
        priority: 'medium'
      };

      validateCreateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body.title).toBe('Valid Task Title');
      expect(req.body.description).toBe('This is a valid task description that meets minimum length requirements');
    });

    test('should pass validation with minimal required fields', () => {
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters'
      };

      validateCreateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.status).toBe('pending'); // Default value
      expect(req.body.priority).toBe('medium'); // Default value
    });

    test('should fail validation without title', () => {
      req.body = {
        description: 'Valid description with enough characters'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Title is required'])
      });
    });

    test('should fail validation without description', () => {
      req.body = {
        title: 'Valid Title'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Description is required'])
      });
    });

    test('should fail validation with title too short', () => {
      req.body = {
        title: 'Ab',
        description: 'Valid description with enough characters'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Title must be at least 3 characters long'])
      });
    });

    test('should fail validation with title too long', () => {
      req.body = {
        title: 'A'.repeat(101),
        description: 'Valid description with enough characters'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Title cannot exceed 100 characters'])
      });
    });

    test('should fail validation with description too short', () => {
      req.body = {
        title: 'Valid Title',
        description: 'Short'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Description must be at least 10 characters long'])
      });
    });

    test('should fail validation with description too long', () => {
      req.body = {
        title: 'Valid Title',
        description: 'A'.repeat(501)
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Description cannot exceed 500 characters'])
      });
    });

    test('should fail validation with invalid status', () => {
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        status: 'invalid-status'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Status must be one of: pending, in-progress, completed, cancelled'])
      });
    });

    test('should fail validation with invalid priority', () => {
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        priority: 'invalid-priority'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Priority must be one of: low, medium, high, urgent'])
      });
    });

    test('should fail validation with past due date', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        dueDate: pastDate
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Due date must be in the future'])
      });
    });

    test('should pass validation with future due date', () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        dueDate: futureDate
      };

      validateCreateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.dueDate).toEqual(futureDate);
    });

    test('should handle tags array correctly', () => {
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        tags: ['work', 'urgent', 'personal']
      };

      validateCreateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.tags).toEqual(['work', 'urgent', 'personal']);
    });

    test('should strip unknown fields', () => {
      req.body = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        unknownField: 'should be removed',
        anotherUnknown: 123
      };

      validateCreateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.unknownField).toBeUndefined();
      expect(req.body.anotherUnknown).toBeUndefined();
    });

    test('should show multiple validation errors', () => {
      req.body = {
        title: 'Ab', // Too short
        description: 'Short', // Too short
        status: 'invalid-status',
        priority: 'invalid-priority'
      };

      validateCreateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining([
          'Title must be at least 3 characters long',
          'Description must be at least 10 characters long',
          'Status must be one of: pending, in-progress, completed, cancelled',
          'Priority must be one of: low, medium, high, urgent'
        ])
      });
    });
  });

  describe('validateUpdateTask', () => {
    test('should pass validation with partial update data', () => {
      req.body = {
        title: 'Updated Title'
      };

      validateUpdateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.title).toBe('Updated Title');
    });

    test('should pass validation with all optional fields', () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      req.body = {
        title: 'Updated Title',
        description: 'Updated description with enough characters',
        status: 'completed',
        priority: 'high',
        dueDate: futureDate,
        tags: ['updated', 'task']
      };

      validateUpdateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.title).toBe('Updated Title');
      expect(req.body.status).toBe('completed');
      expect(req.body.priority).toBe('high');
    });

    test('should pass validation with empty body (no updates)', () => {
      req.body = {};

      validateUpdateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should fail validation with invalid title in update', () => {
      req.body = {
        title: 'Ab' // Too short
      };

      validateUpdateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: expect.arrayContaining(['Title must be at least 3 characters long'])
      });
    });

    test('should fail validation with invalid description in update', () => {
      req.body = {
        description: 'Short' // Too short
      };

      validateUpdateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should allow null due date in update', () => {
      req.body = {
        dueDate: null
      };

      validateUpdateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.dueDate).toBeNull();
    });

    test('should fail validation with past due date in update', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      req.body = {
        dueDate: pastDate
      };

      validateUpdateTask(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should strip unknown fields in update', () => {
      req.body = {
        title: 'Updated Title',
        unknownField: 'should be removed'
      };

      validateUpdateTask(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.body.title).toBe('Updated Title');
      expect(req.body.unknownField).toBeUndefined();
    });
  });
});