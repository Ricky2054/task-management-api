// Error handling middleware

// Custom error class
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// MongoDB duplicate key error
const handleDuplicateKeyError = (error) => {
  const message = `Duplicate field value entered`;
  return new ApiError(message, 400);
};

// MongoDB validation error
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(val => val.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

// MongoDB cast error (invalid ObjectId)
const handleCastError = (error) => {
  const message = `Resource not found with id: ${error.value}`;
  return new ApiError(message, 404);
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(`Error: ${err.message}`);

  // MongoDB bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastError(error);
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    error = handleDuplicateKeyError(error);
  }

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(error);
  }

  // Set default error
  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = 'Internal Server Error';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = {
  ApiError,
  errorHandler,
  notFound
}; 