/**
 * utils/formatters.js
 * Lightweight Indian Local Format Engine
 */

/**
 * Formats a number into Indian Rupee (INR) format using Lakhs and Crores.
 * Example: 150000 -> ₹1,50,000
 * @param {number} value 
 * @returns {string} Formatted currency string
 */
export const formatINR = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a plain number using the Indian Numbering System (Lakhs/Crores).
 * Example: 150000 -> 1,50,000
 * @param {number} value 
 * @returns {string} Formatted number string
 */
export const formatIndianNumber = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-IN').format(value);
};
