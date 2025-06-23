const { ApiError, errorHandler, notFound } = require('../../../middleware/errorHandler');

describe('Error Handler Middleware Unit Tests', () => {
  let req, res, next;
  let consoleErrorSpy;

  beforeEach(() => {
    req = {
      originalUrl: '/api/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Mock console methods to avoid test output noise
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
  });

  describe('ApiError Class', () => {
    test('should create ApiError with message and status code', () => {
      const error = new ApiError('Test error message', 400);

      expect(error.message).toBe('Test error message');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    test('should capture stack trace', () => {
      const error = new ApiError('Test error', 500);

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('notFound Middleware', () => {
    test('should create 404 error for non-existent route', () => {
      req.originalUrl = '/api/non-existent-route';

      notFound(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Route /api/non-existent-route not found',
          statusCode: 404
        })
      );
    });

    test('should pass ApiError to next middleware', () => {
      notFound(req, res, next);

      const passedError = next.mock.calls[0][0];
      expect(passedError instanceof ApiError).toBe(true);
    });
  });

  describe('errorHandler Middleware', () => {
    test('should handle ApiError correctly', () => {
      const apiError = new ApiError('Custom API error', 400);

      errorHandler(apiError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom API error'
      });
    });

    test('should handle MongoDB CastError', () => {
      const castError = {
        name: 'CastError',
        value: 'invalid-object-id',
        message: 'Cast to ObjectId failed'
      };

      errorHandler(castError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found with id: invalid-object-id'
      });
    });

    test('should handle MongoDB duplicate key error', () => {
      const duplicateError = {
        code: 11000,
        message: 'Duplicate key error'
      };

      errorHandler(duplicateError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Duplicate field value entered'
      });
    });

    test('should handle MongoDB validation error', () => {
      const validationError = {
        name: 'ValidationError',
        errors: {
          title: { message: 'Title is required' },
          description: { message: 'Description is too short' }
        },
        message: 'Validation failed'
      };

      errorHandler(validationError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid input data: Title is required. Description is too short'
      });
    });

    test('should handle generic errors with default 500 status', () => {
      const genericError = new Error('Something went wrong');

      errorHandler(genericError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error'
      });
    });

    test('should include stack trace in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.stack = 'Test stack trace';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error',
        stack: 'Test stack trace'
      });

      process.env.NODE_ENV = originalEnv;
    });

    test('should not include stack trace in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      error.stack = 'Test stack trace';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error'
      });

      // Check that stack is not included
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.stack).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });

    test('should log error message to console', () => {
      const error = new Error('Test error for logging');

      errorHandler(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith('Error: Test error for logging');
    });

    test('should preserve custom error properties', () => {
      const customError = new Error('Custom error');
      customError.statusCode = 403;
      customError.customProperty = 'test value';

      errorHandler(customError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom error'
      });
    });

    test('should handle error with existing statusCode', () => {
      const error = new Error('Forbidden access');
      error.statusCode = 403;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Forbidden access'
      });
    });

    test('should handle null or undefined error gracefully', () => {
      const nullError = null;

      errorHandler(nullError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error'
      });
    });
  });

  describe('Error Handler Edge Cases', () => {
    test('should handle error without message property', () => {
      const errorWithoutMessage = {
        name: 'CustomError',
        statusCode: 400
      };

      errorHandler(errorWithoutMessage, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: undefined
      });
    });

    test('should handle ValidationError with empty errors object', () => {
      const validationError = {
        name: 'ValidationError',
        errors: {},
        message: 'Validation failed'
      };

      errorHandler(validationError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid input data: '
      });
    });

    test('should handle CastError without value property', () => {
      const castError = {
        name: 'CastError',
        message: 'Cast error without value'
      };

      errorHandler(castError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found with id: undefined'
      });
    });
  });
}); 