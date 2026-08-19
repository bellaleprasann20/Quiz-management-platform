// frontend/src/utils/formatDate.js

/**
 * Formats a date string into a standard readable format.
 * Example: "Oct 24, 2026"
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a date string including time.
 * Example: "Oct 24, 2026 • 2:30 PM"
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
};

/**
 * Returns a relative time string.
 * Example: "2 hours ago", "just now", "3 days ago"
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(date);
};