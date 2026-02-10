/**
 * Sanitize string inputs for safe storage (XSS prevention, length limits).
 * Used alongside express-validator; DB uses parameterized queries for SQL injection prevention.
 */
const MAX_TEXT = 5000;
const MAX_SHORT = 500;

export function sanitizeString(value, maxLength = MAX_SHORT) {
  if (value == null || typeof value !== 'string') return value;
  return value
    .trim()
    .replace(/[<>]/g, '') // strip angle brackets to reduce XSS risk
    .slice(0, maxLength);
}

export function sanitizeText(value) {
  return sanitizeString(value, MAX_TEXT);
}

export function sanitizeBody(body, textFields = [], shortFields = []) {
  const out = { ...body };
  textFields.forEach((f) => {
    if (out[f] != null) out[f] = sanitizeText(out[f]);
  });
  shortFields.forEach((f) => {
    if (out[f] != null) out[f] = sanitizeString(out[f]);
  });
  return out;
}
