import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Habit validation schemas
export const habitSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  icon: Joi.string().max(10).optional(),
  target: Joi.number().integer().min(1).required(),
  unit: Joi.string().max(20).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

export const updateHabitSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  icon: Joi.string().max(10).optional(),
  target: Joi.number().integer().min(1).optional(),
  completed: Joi.number().integer().min(0).optional(),
  unit: Joi.string().max(20).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

// Mood validation schemas
export const moodSchema = Joi.object({
  mood: Joi.number().integer().min(1).max(5).required(),
  moodLabel: Joi.string().max(20).optional(),
  notes: Joi.string().max(500).optional(),
  energy: Joi.number().integer().min(1).max(5).optional(),
  date: Joi.date().optional()
});

// Journal validation schemas
export const journalSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  content: Joi.string().min(1).required(),
  mood: Joi.number().integer().min(1).max(5).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  date: Joi.date().optional(),
  isPrivate: Joi.boolean().optional()
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        message: 'Validation error',
        errors: errorMessages
      });
    }

    req.body = value;
    next();
  };
};

// Legacy validation functions for backward compatibility
export const validateUser = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};