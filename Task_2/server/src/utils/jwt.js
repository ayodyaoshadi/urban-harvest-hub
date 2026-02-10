import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'urban-harvest-hub-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT with userId and role.
 * @param {{ userId: number, role: string }} payload
 * @returns {string} signed token
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT and return the decoded payload (userId, role, etc.).
 * @param {string} token
 * @returns {{ userId: number, role: string, iat?: number, exp?: number }}
 * @throws {jwt.JsonWebTokenError}
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
