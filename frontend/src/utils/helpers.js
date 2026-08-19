// frontend/src/utils/helpers.js

/**
 * Combines multiple class names conditionally.
 * Useful for Tailwind CSS dynamic classes.
 * @param {...string} classes 
 * @returns {string}
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Calculates a percentage and formats it to a fixed decimal.
 * @param {number} score 
 * @param {number} total 
 * @returns {number}
 */
export const calculatePercentage = (score, total) => {
  if (!total || total === 0) return 0;
  return Math.round((score / total) * 100);
};

/**
 * Extracts initials from a user's full name or email.
 * @param {string} name 
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  
  // If it's an email, grab the first letter
  if (name.includes('@')) return name.charAt(0).toUpperCase();

  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};