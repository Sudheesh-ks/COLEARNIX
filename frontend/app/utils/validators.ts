/**
 * Validation Utility
 * Common rules for form inputs
 */

export const validators = {
  isEmail: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  isPasswordStrong: (password: string): boolean => {
    // Min 8 chars, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  },

  isValidName: (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 50;
  },

  required: (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },
};
