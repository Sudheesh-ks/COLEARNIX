/**
 * Formatters Utility
 * Standardizes how data is presented in the UI
 */

export const formatters = {
  /**
   * Formats a date string or object into a human readable format
   * Example: April 24, 2024
   */
  date: (date: string | Date | undefined): string => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  /**
   * Capitalizes the first letter of a string
   */
  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Formats numbers with commas
   */
  number: (num: number): string => {
    return new Intl.NumberFormat().format(num);
  },
};
