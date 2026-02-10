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

// GET /api/subscriptions – list current user's subscriptions
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      `SELECT s.id, s.user_id, s.product_id, s.frequency, s.quantity, s.status, s.created_at, s.updated_at,
              p.name AS product_name, p.price
       FROM subscriptions s
       LEFT JOIN products p ON s.product_id = p.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions – create subscription (product box)
router.post(
  '/',
  requireAuth,
  [
    body('product_id').isInt({ min: 1 }).withMessage('product_id is required'),
    body('frequency').optional().isIn(['weekly', 'biweekly', 'monthly']).withMessage('frequency must be weekly, biweekly, or monthly'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be at least 1'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { product_id, frequency = 'monthly', quantity = 1 } = req.body;
      const userId = req.user.id;
      const db = getDb();
      const [productRows] = await db.execute('SELECT id FROM products WHERE id = ?', [product_id]);
      if (productRows.length === 0) {
        return res.status(404).json({ error: true, message: 'Product not found' });
      }
      await db.execute(
        `INSERT INTO subscriptions (user_id, product_id, frequency, quantity)
         VALUES (?, ?, ?, ?)`,
        [userId, product_id, frequency, quantity]
      );
      const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
      const newId = insertResult[0].id;
      const [rows] = await db.execute(
        `SELECT s.id, s.user_id, s.product_id, s.frequency, s.quantity, s.status, s.created_at,
                p.name AS product_name
         FROM subscriptions s
         LEFT JOIN products p ON s.product_id = p.id
         WHERE s.id = ?`,
        [newId]
      );
      res.status(201).json({ success: true, data: rows[0], message: 'Subscription created' });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/subscriptions – update subscription (e.g. frequency, quantity)
router.put(
  '/',
  requireAuth,
  [
    body('id').isInt({ min: 1 }).withMessage('subscription id is required'),
    body('frequency').optional().isIn(['weekly', 'biweekly', 'monthly']),
    body('quantity').optional().isInt({ min: 1 }),
    body('status').optional().isIn(['active', 'paused', 'cancelled']),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { id, frequency, quantity, status } = req.body;
      const userId = req.user.id;
      const db = getDb();
      const [existing] = await db.execute('SELECT id FROM subscriptions WHERE id = ? AND user_id = ?', [id, userId]);
      if (existing.length === 0) {
        return res.status(404).json({ error: true, message: 'Subscription not found' });
      }
      const updates = [];
      const params = [];
      if (frequency !== undefined) {
        updates.push('frequency = ?');
        params.push(frequency);
      }
      if (quantity !== undefined) {
        updates.push('quantity = ?');
        params.push(quantity);
      }
      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }
      if (updates.length === 0) {
        return res.status(400).json({ error: true, message: 'No fields to update' });
      }
      params.push(id);
      await db.execute(`UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`, params);
      const [rows] = await db.execute(
        `SELECT s.id, s.user_id, s.product_id, s.frequency, s.quantity, s.status, s.updated_at
         FROM subscriptions s WHERE s.id = ?`,
        [id]
      );
      res.json({ success: true, data: rows[0], message: 'Subscription updated' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
