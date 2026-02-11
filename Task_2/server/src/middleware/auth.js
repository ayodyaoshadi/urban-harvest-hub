import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware that requires a valid JWT in Authorization: Bearer <token>.
 * On success, sets req.user = { id, role } (id from token payload as userId).
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Authentication required' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}

/**
 * Requires authentication and role === 'admin'. Use for admin-only routes
 * (e.g. create/update/delete workshops, events, products; list all users).
 */
export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Admin access required' });
    }
    next();
  });
}
