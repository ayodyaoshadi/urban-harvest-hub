import { Router } from 'express';
import { getDb } from '../db/database.js';
import { productValidators, handleValidationErrors } from '../middleware/validation.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (req.query.include_out_of_stock !== 'true') sql += ' AND stock_quantity > 0';
    if (req.query.category) {
      sql += ' AND category = ?';
      params.push(req.query.category);
    }
    if (req.query.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const s = `%${req.query.search}%`;
      params.push(s, s);
    }
    sql += ' ORDER BY name ASC';
    const [rows] = await db.execute(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: true, message: 'Invalid id' });
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    const row = rows[0] || null;
    if (!row) return res.status(404).json({ error: true, message: 'Product not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAdmin, productValidators.create, handleValidationErrors, async (req, res, next) => {
  try {
    const db = getDb();
    const b = req.body;
    const rating = b.sustainability_rating != null ? Math.min(5, Math.max(1, parseInt(b.sustainability_rating, 10))) : null;
    await db.execute(
      `INSERT INTO products (name, description, price, category, stock_quantity, sku, image_url, sustainability_rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.name,
        b.description,
        parseFloat(b.price),
        b.category || 'general',
        b.stock_quantity != null ? parseInt(b.stock_quantity, 10) : 0,
        b.sku || null,
        b.image_url || null,
        rating,
      ]
    );
    const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const newId = insertResult[0].id;
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [newId]);
    res.status(201).json({ success: true, data: rows[0], message: 'Product created successfully' });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAdmin, productValidators.update, handleValidationErrors, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = getDb();
    const [existingRows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: true, message: 'Product not found' });
    const b = req.body;
    const allowed = ['name', 'description', 'price', 'category', 'stock_quantity', 'sku', 'image_url', 'sustainability_rating'];
    const updates = [];
    const values = [];
    allowed.forEach((f) => {
      if (b[f] !== undefined) {
        updates.push(`${f} = ?`);
        if (f === 'price' || f === 'stock_quantity') values.push(parseFloat(b[f]));
        else if (f === 'sustainability_rating') values.push(b[f] == null ? null : Math.min(5, Math.max(1, parseInt(b[f], 10))));
        else values.push(b[f]);
      }
    });
    if (updates.length === 0) return res.status(400).json({ error: true, message: 'No fields to update' });
    values.push(id);
    await db.execute(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ success: true, data: rows[0], message: 'Product updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: true, message: 'Invalid id' });
    const db = getDb();
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: true, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
