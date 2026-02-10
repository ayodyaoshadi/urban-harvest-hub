/**
 * Format a date value to YYYY-MM-DD for API responses.
 * MySQL DATE columns are returned as JS Date objects (often local midnight).
 * JSON.stringify uses UTC, so the client can see the wrong calendar day.
 * This ensures we always send the intended calendar date as YYYY-MM-DD.
 */
export function formatDateOnly(val) {
  if (val == null) return val;
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}(T|$)/.test(val)) return val.substring(0, 10);
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Apply formatDateOnly to listed fields on an object (returns new object). */
export function formatDateFields(row, fields = ['date', 'booking_date']) {
  if (!row || typeof row !== 'object') return row;
  const out = { ...row };
  for (const field of fields) {
    if (out[field] != null) out[field] = formatDateOnly(out[field]);
  }
  return out;
}
