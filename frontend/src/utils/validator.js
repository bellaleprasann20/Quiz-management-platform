// frontend/src/utils/validator.js

/**
 * Validates an email address format.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength (minimum 8 characters, at least one number).
 * @param {string} password 
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
  // At least 8 chars long and contains at least one digit
  const passwordRegex = /^(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Checks if a required field is empty.
 * @param {string} value 
 * @returns {boolean}
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};