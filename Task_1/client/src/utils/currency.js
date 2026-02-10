/**
 * Format prices in Sri Lankan Rupees (LKR).
 * Database and API store prices in LKR (e.g. 14000 for Rs. 14,000).
 */

/**
 * Format a value already in LKR for display: "Rs. 14,000" or "Free" if zero.
 */
export function formatLKR(lkrAmount) {
  if (lkrAmount == null) return 'Free';
  const n = Number(lkrAmount);
  if (Number.isNaN(n) || n === 0) return 'Free';
  return `Rs. ${Math.round(n).toLocaleString('en-LK')}`;
}

/** @deprecated Use formatLKR when value is already in LKR. Kept for backward compatibility. */
const GBP_TO_LKR = 400;
export function toLKR(priceInGbp) {
  if (priceInGbp == null || Number.isNaN(Number(priceInGbp))) return 0;
  return Math.round(Number(priceInGbp) * GBP_TO_LKR);
}

/**
 * Format price for display. Use when value is already in LKR (from API/DB).
 * "Rs. 10,000" or "Free" if zero.
 */
export function formatPriceLKR(priceInLkr) {
  return formatLKR(priceInLkr);
}
