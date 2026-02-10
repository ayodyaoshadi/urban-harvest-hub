import { Router } from 'express';
import { getDb } from '../db/database.js';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, message: errors.array().map((e) => e.msg).join('; ') });
  }
  next();
}

// GET /api/reviews – list reviews filtered by workshop_id, event_id, or product_id (query params)
router.get('/', async (req, res, next) => {
  try {
    const { workshop_id, event_id, product_id } = req.query;
    if (!workshop_id && !event_id && !product_id) {
      return res.status(400).json({ error: true, message: 'One of workshop_id, event_id, or product_id is required' });
    }
    const db = getDb();
    const conditions = [];
    const params = [];
    if (workshop_id) {
      conditions.push('r.workshop_id = ?');
      params.push(parseInt(workshop_id, 10));
    }
    if (event_id) {
      conditions.push('r.event_id = ?');
      params.push(parseInt(event_id, 10));
    }
    if (product_id) {
      conditions.push('r.product_id = ?');
      params.push(parseInt(product_id, 10));
    }
    const [rows] = await db.execute(
      `SELECT r.id, r.user_id, r.workshop_id, r.event_id, r.product_id, r.rating, r.comment, r.created_at,
              u.username, u.full_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY r.created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews – create a review (requires JWT; user_id from token)
router.post(
  '/',
  requireAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    body('workshop_id').optional().isInt({ min: 1 }),
    body('event_id').optional().isInt({ min: 1 }),
    body('product_id').optional().isInt({ min: 1 }),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { rating, comment, workshop_id, event_id, product_id } = req.body;
      if (!workshop_id && !event_id && !product_id) {
        return res.status(400).json({ error: true, message: 'One of workshop_id, event_id, or product_id is required' });
      }
      const userId = req.user.id;
      const db = getDb();
      await db.execute(
        `INSERT INTO reviews (user_id, workshop_id, event_id, product_id, rating, comment)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          workshop_id ? parseInt(workshop_id, 10) : null,
          event_id ? parseInt(event_id, 10) : null,
          product_id ? parseInt(product_id, 10) : null,
          rating,
          comment || null,
        ]
      );
      const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
      const newId = insertResult[0].id;
      const [rows] = await db.execute(
        `SELECT r.id, r.user_id, r.workshop_id, r.event_id, r.product_id, r.rating, r.comment, r.created_at,
                u.username, u.full_name
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [newId]
      );
      res.status(201).json({ success: true, data: rows[0], message: 'Review submitted' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
