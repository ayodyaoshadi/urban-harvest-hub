import { body, param, query, validationResult } from 'express-validator';

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: errors.array().map(e => e.msg).join('; '),
      errors: errors.array(),
    });
  }
  next();
}

export const workshopValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid date (YYYY-MM-DD) required'),
    body('time').optional().isString(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('category').optional().trim(),
    body('max_participants').optional().isInt({ min: 1 }).withMessage('max_participants must be at least 1'),
    body('location').optional().trim(),
    body('instructor_name').optional().trim(),
    body('image_url').optional().trim(),
  ],
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid id required'),
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('time').optional().isString(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().trim(),
    body('max_participants').optional().isInt({ min: 1 }),
    body('location').optional().trim(),
    body('instructor_name').optional().trim(),
    body('image_url').optional().trim(),
  ],
};

export const eventValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid date (YYYY-MM-DD) required'),
    body('time').optional().isString(),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('category').optional().trim(),
    body('organizer').optional().trim(),
    body('is_free').optional().isBoolean(),
    body('price').optional().isFloat({ min: 0 }),
    body('image_url').optional().trim(),
  ],
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid id required'),
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('time').optional().isString(),
    body('location').optional().trim().notEmpty(),
    body('category').optional().trim(),
    body('organizer').optional().trim(),
    body('is_free').optional().isBoolean(),
    body('price').optional().isFloat({ min: 0 }),
    body('image_url').optional().trim(),
  ],
};

export const productValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }).withMessage('Name too long'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('category').optional().trim(),
    body('stock_quantity').optional().isInt({ min: 0 }).withMessage('stock_quantity must be 0 or more'),
    body('sku').optional().trim(),
    body('image_url').optional().trim(),
    body('sustainability_rating').optional().isInt({ min: 1, max: 5 }).withMessage('sustainability_rating must be 1–5'),
  ],
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid id required'),
    body('name').optional().trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().trim(),
    body('stock_quantity').optional().isInt({ min: 0 }),
    body('sku').optional().trim(),
    body('image_url').optional().trim(),
    body('sustainability_rating').optional().isInt({ min: 1, max: 5 }),
  ],
};
