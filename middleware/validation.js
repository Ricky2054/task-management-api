const Joi = require('joi');

// Task validation schema
const taskValidationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
    
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed', 'cancelled')
    .default('pending')
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed, cancelled'
    }),
    
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium')
    .messages({
      'any.only': 'Priority must be one of: low, medium, high, urgent'
    }),
    
  dueDate: Joi.date()
    .greater('now')
    .optional()
    .messages({
      'date.greater': 'Due date must be in the future'
    }),
    
  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .optional()
});

// Update validation schema (all fields optional except those being updated)
const taskUpdateValidationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  
  description: Joi.string()
    .min(10)
    .max(500)
    .optional()
    .messages({
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters'
    }),
    
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed, cancelled'
    }),
    
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high, urgent'
    }),
    
  dueDate: Joi.date()
    .greater('now')
    .allow(null)
    .optional()
    .messages({
      'date.greater': 'Due date must be in the future'
    }),
    
  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .optional()
});

// Middleware function to validate request body
const validateTask = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages
      });
    }

    req.body = value;
    next();
  };
};

// Export validation middleware
module.exports = {
  validateCreateTask: validateTask(taskValidationSchema),
  validateUpdateTask: validateTask(taskUpdateValidationSchema)
}; 