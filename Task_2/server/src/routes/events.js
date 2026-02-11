import { Router } from 'express';
import { getDb } from '../db/database.js';
import { eventValidators, handleValidationErrors } from '../middleware/validation.js';
import { formatDateFields } from '../utils/dateFormat.js';

const router = Router();
const dateFields = ['date'];

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    if (req.query.upcoming === 'true') sql += ' AND date >= CURDATE()';
    if (req.query.category) {
      sql += ' AND category = ?';
      params.push(req.query.category);
    }
    if (req.query.is_free === 'true') sql += ' AND is_free = 1';
    sql += ' ORDER BY date ASC, time ASC';
    const [rows] = await db.execute(sql, params);
    res.json({ success: true, data: rows.map((r) => formatDateFields(r, dateFields)) });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: true, message: 'Invalid id' });
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    const row = rows[0] || null;
    if (!row) return res.status(404).json({ error: true, message: 'Event not found' });
    res.json({ success: true, data: formatDateFields(row, dateFields) });
  } catch (err) {
    next(err);
  }
});

router.post('/', eventValidators.create, handleValidationErrors, async (req, res, next) => {
  try {
    const db = getDb();
    const b = req.body;
    const isFree = b.is_free === true || b.is_free === 'true' || (b.price != null && parseFloat(b.price) === 0);
    const price = isFree ? 0 : parseFloat(b.price || 0);
    await db.execute(
      `INSERT INTO events (title, description, date, time, location, category, organizer, is_free, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.title,
        b.description,
        b.date,
        b.time || '10:00',
        b.location,
        b.category || 'general',
        b.organizer || '',
        isFree ? 1 : 0,
        price,
      ]
    );
    const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const newId = insertResult[0].id;
    const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [newId]);
    res.status(201).json({ success: true, data: formatDateFields(rows[0], dateFields), message: 'Event created successfully' });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', eventValidators.update, handleValidationErrors, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = getDb();
    const [existingRows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: true, message: 'Event not found' });
    const b = req.body;
    const allowed = ['title', 'description', 'date', 'time', 'location', 'category', 'organizer', 'is_free', 'price', 'image_url'];
    const updates = [];
    const values = [];
    allowed.forEach((f) => {
      if (b[f] !== undefined) {
        updates.push(`${f} = ?`);
        if (f === 'is_free') values.push(b[f] ? 1 : 0);
        else if (f === 'price') values.push(parseFloat(b[f]));
        else values.push(b[f]);
      }
    });
    if (updates.length === 0) return res.status(400).json({ error: true, message: 'No fields to update' });
    values.push(id);
    await db.execute(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    res.json({ success: true, data: formatDateFields(rows[0], dateFields), message: 'Event updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: true, message: 'Invalid id' });
    const db = getDb();
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: true, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
