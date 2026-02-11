import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getDb } from '../db/database.js';
import { body, validationResult } from 'express-validator';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const SALT_ROUNDS = 10;

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: errors.array().map((e) => e.msg).join('; '),
    });
  }
  next();
}

// POST /api/auth/register – save to users table (no 'salt' column; bcrypt hash only)
router.post(
  '/register',
  [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const db = getDb();
      const { full_name, username, email, password } = req.body;

      const [existingEmail] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ error: true, message: 'Email already registered' });
      }
      const [existingUsername] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
      if (existingUsername.length > 0) {
        return res.status(400).json({ error: true, message: 'Username already taken' });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      await db.execute(
        `INSERT INTO users (username, email, password_hash, full_name, role)
         VALUES (?, ?, ?, ?, 'user')`,
        [username, email, password_hash, full_name || '']
      );

      const [insertResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
      const newId = insertResult[0].id;
      const [rows] = await db.execute(
        'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
        [newId]
      );
      const user = rows[0];
      if (!user) return res.status(500).json({ error: true, message: 'Registration failed' });

      const token = signToken({ userId: user.id, role: user.role });
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
          },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const db = getDb();
      const { username, password } = req.body;

      const [rows] = await db.execute(
        'SELECT id, username, email, full_name, role, password_hash FROM users WHERE username = ?',
        [username]
      );
      const user = rows[0];
      if (!user) {
        return res.status(401).json({ error: true, message: 'Invalid username or password' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: true, message: 'Invalid username or password' });
      }

      const { password_hash: _, ...safeUser } = user;
      const token = signToken({ userId: user.id, role: user.role });
      res.json({
        success: true,
        data: { user: safeUser, token },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me – return current user (requires JWT)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ error: true, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/users – list all users (no password_hash), e.g. for Postman/admin
router.get('/users', async (req, res, next) => {
  try {
    const db = getDb();
    const [rows] = await db.execute(
      'SELECT id, username, email, full_name, role, created_at, updated_at FROM users ORDER BY id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

export default router;
