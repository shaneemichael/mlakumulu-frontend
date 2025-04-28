// src/utils/validationUtils.ts

/**
 * Validate an email address
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate a phone number
   * @param phone - Phone number to validate
   * @returns Boolean indicating if phone number is valid
   */
  export const isValidPhone = (phone: string): boolean => {
    // This is a simple validation that checks if the phone number
    // contains only digits, spaces, dashes, parentheses, and plus sign
    const phoneRegex = /^[0-9\s\-\(\)\+]+$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * Validate a passport number (basic validation)
   * @param passport - Passport number to validate
   * @returns Boolean indicating if passport number is valid
   */
  export const isValidPassport = (passport: string): boolean => {
    // This is a simple validation that checks if the passport number
    // is not empty and has at least 5 characters
    return passport.trim().length >= 5;
  };
  
  /**
   * Validate travel dates (end date must be after start date)
   * @param startDate - Start date string
   * @param endDate - End date string
   * @returns Boolean indicating if dates are valid
   */
  export const areValidTravelDates = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end > start;
  };