import { Router } from 'express';
import { getDb } from '../db/database.js';
import { workshopValidators, handleValidationErrors } from '../middleware/validation.js';
import { formatDateFields } from '../utils/dateFormat.js';

const router = Router();
const dateFields = ['date'];

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    let sql = 'SELECT * FROM workshops WHERE 1=1';
    const params = [];
    if (req.query.upcoming === 'true') {
      sql += ' AND date >= CURDATE()';
    }
    if (req.query.category) {
      sql += ' AND category = ?';
      params.push(req.query.category);
    }
    if (req.query.search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const s = `%${req.query.search}%`;
      params.push(s, s);
    }
    sql += ' ORDER BY date ASC';
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
    const [rows] = await db.execute('SELECT * FROM workshops WHERE id = ?', [id]);
    const row = rows[0] || null;
    if (!row) return res.status(404).json({ error: true, message: 'Workshop not found' });
    res.json({ success: true, data: formatDateFields(row, dateFields) });
  } catch (err) {
    next(err);
  }
});

router.post('/', workshopValidators.create, handleValidationErrors, async (req, res, next) => {
  try {
    const db = getDb();
    const b = req.body;
    await db.execute(
      `INSERT INTO workshops (title, description, date, time, price, category, max_participants, location, instructor_name, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.title,
        b.description,
        b.date,
        b.time || '10:00',
        parseFloat(b.price),
        b.category || 'general',
        b.max_participants != null ? parseInt(b.max_participants, 10) : 20,
        b.location || '',
        b.instructor_name || '',
        b.image_url || null,
      ]
    );
    const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const newId = insertResult[0].id;
    const [rows] = await db.execute('SELECT * FROM workshops WHERE id = ?', [newId]);
    res.status(201).json({ success: true, data: formatDateFields(rows[0], dateFields), message: 'Workshop created successfully' });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', workshopValidators.update, handleValidationErrors, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = getDb();
    const [existingRows] = await db.execute('SELECT * FROM workshops WHERE id = ?', [id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: true, message: 'Workshop not found' });
    const b = req.body;
    const allowed = ['title', 'description', 'date', 'time', 'price', 'category', 'max_participants', 'location', 'instructor_name', 'image_url'];
    const updates = [];
    const values = [];
    allowed.forEach((f) => {
      if (b[f] !== undefined) {
        updates.push(`${f} = ?`);
        values.push(typeof existing[f] === 'number' ? (f === 'price' ? parseFloat(b[f]) : parseInt(b[f], 10)) : b[f]);
      }
    });
    if (updates.length === 0) return res.status(400).json({ error: true, message: 'No fields to update' });
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    await db.execute(`UPDATE workshops SET ${updates.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.execute('SELECT * FROM workshops WHERE id = ?', [id]);
    res.json({ success: true, data: formatDateFields(rows[0], dateFields), message: 'Workshop updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: true, message: 'Invalid id' });
    const db = getDb();
    const [result] = await db.execute('DELETE FROM workshops WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: true, message: 'Workshop not found' });
    res.json({ success: true, message: 'Workshop deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
