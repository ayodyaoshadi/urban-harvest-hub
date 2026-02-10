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

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    const [rows] = await db.execute(
      `SELECT b.*, w.title AS workshop_title, w.date AS workshop_date, w.time AS workshop_time, w.location AS workshop_location,
             e.title AS event_title, e.date AS event_date, e.time AS event_time, e.location AS event_location
      FROM bookings b
      LEFT JOIN workshops w ON b.workshop_id = w.id
      LEFT JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('booking_date').isISO8601().withMessage('Valid booking_date required'),
    body('workshop_id').optional().isInt({ min: 1 }),
    body('event_id').optional().isInt({ min: 1 }),
    body('participants').optional().isInt({ min: 1 }).withMessage('participants must be at least 1'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const b = req.body;
      const userId = req.user.id;
      if (!b.workshop_id && !b.event_id) {
        return res.status(400).json({ error: true, message: 'Either workshop_id or event_id is required' });
      }
      const db = getDb();
      let totalAmount = 0;
      if (b.workshop_id) {
        const [wRows] = await db.execute('SELECT price FROM workshops WHERE id = ?', [parseInt(b.workshop_id, 10)]);
        const w = wRows[0];
        if (!w) return res.status(404).json({ error: true, message: 'Workshop not found' });
        totalAmount = w.price * (parseInt(b.participants, 10) || 1);
      } else {
        const [eRows] = await db.execute('SELECT price, is_free FROM events WHERE id = ?', [parseInt(b.event_id, 10)]);
        const e = eRows[0];
        if (!e) return res.status(404).json({ error: true, message: 'Event not found' });
        totalAmount = e.is_free ? 0 : e.price * (parseInt(b.participants, 10) || 1);
      }
      await db.execute(
        `INSERT INTO bookings (user_id, workshop_id, event_id, booking_date, participants, total_amount, status, special_requirements)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          b.workshop_id ? parseInt(b.workshop_id, 10) : null,
          b.event_id ? parseInt(b.event_id, 10) : null,
          b.booking_date,
          parseInt(b.participants, 10) || 1,
          totalAmount,
          b.status || 'pending',
          b.special_requirements || null,
        ]
      );
      const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
      const newId = insertResult[0].id;
      const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [newId]);
      res.status(201).json({ success: true, data: rows[0], message: 'Booking created successfully' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
